import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { Get, Post } from "@/services/http-service";
import { TCaregiver, TUser } from "@/types";
import { TCaregiverGallery } from "@/types/caregivers";

export interface PetOwnerCaregiverContextValues {
  getCaregivers: (_filter: { serviceTypes: number[] }) => void;
  caregivers: TCaregiver[];
  isLoadingCaregivers: boolean;
  getCaregiver: (_caregiverId: string) => void;
  caregiver: TCaregiver;
  isLoadingCaregiver: boolean;
  caregiverGalleries: TCaregiverGallery[];
  isLoadingCaregiverGalleries: boolean;
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

  const {
    data: caregiverGalleries = [],
    isLoading: isLoadingCaregiverGalleries,
  } = useQuery<TCaregiverGallery[]>({
    queryKey: ["caregiver-galleries", userId],
    queryFn: () => Get(`/care-givers/${userId}/galleries`),
    enabled: !!userId,
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
        caregiverGalleries,
        isLoadingCaregiverGalleries,
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
