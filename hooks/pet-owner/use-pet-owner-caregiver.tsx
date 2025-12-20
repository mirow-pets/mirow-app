import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { Get, Post } from "@/services/http-service";
import { TCaregiver, TUser } from "@/types";
import { onError } from "@/utils";

export interface PetOwnerCaregiverContextValues {
  getCaregivers: (_filter: { serviceTypes: number[] }) => void;
  caregivers: TCaregiver[];
  isLoadingCaregivers: boolean;
  getCaregiver: (_caregiverId: string) => void;
  caregiver: TCaregiver;
  isLoadingCaregiver: boolean;
  setAsFavourite: (_input: {
    userId: TCaregiver["usersId"];
    isFavourite: boolean;
  }) => void;
  isSettingAsFavourite: boolean;
}

export const PetOwnerCaregiverContext =
  createContext<PetOwnerCaregiverContextValues | null>(null);

export interface PetOwnerCaregiverProviderProps {
  children: ReactNode;
}

const PetOwnerCaregiverProvider = ({
  children,
}: PetOwnerCaregiverProviderProps) => {
  const { currUser } = useAuth();
  const [userId, setUserId] = useState<TCaregiver["usersId"]>();
  const queryClient = useQueryClient();

  const {
    data: caregivers = [],
    isPending: isLoadingCaregivers,
    mutate: getCaregivers,
  } = useMutation<TCaregiver[], Error, { serviceTypes: number[] }>({
    mutationFn: (filter) => Post("/users/care-givers", filter),
  });

  const { data: caregiver, isLoading: isLoadingCaregiver } = useQuery({
    queryKey: ["caregiver", userId],
    queryFn: () => Get(`/users/care-givers/${userId}`),
    enabled: !!currUser && !!userId,
  });

  const { mutate: setAsFavourite, isPending: isSettingAsFavourite } =
    useMutation({
      mutationFn: ({
        userId,
        isFavourite,
      }: {
        userId: TCaregiver["usersId"];
        isFavourite: boolean;
      }) =>
        Post(`/v2/users/caregivers/${userId}/favourites`, {
          isFavourite,
        }),
      onSuccess: async () => {
        const queryKeys = [
          ["/users/favourites/care-givers"],
          ["booking"],
          ["caregiver", userId],
        ];

        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.refetchQueries({
              queryKey,
            })
          )
        );
      },
      onError,
    });

  const getCaregiver = (userId: TUser["id"]) => {
    setUserId(userId);
  };

  return (
    <PetOwnerCaregiverContext.Provider
      value={{
        getCaregivers,
        caregivers,
        isLoadingCaregivers,
        getCaregiver,
        caregiver,
        isLoadingCaregiver,
        setAsFavourite,
        isSettingAsFavourite,
      }}
    >
      {children}
    </PetOwnerCaregiverContext.Provider>
  );
};

export default PetOwnerCaregiverProvider;

export const usePetOwnerCaregiver = () => {
  const caregiver = useContext(PetOwnerCaregiverContext);

  if (!caregiver) {
    throw new Error(
      "Cannot access usePetOwnerCaregiver outside PetOwnerCaregiverProvider"
    );
  }
  return caregiver;
};
