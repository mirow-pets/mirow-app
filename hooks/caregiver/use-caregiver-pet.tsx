import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { Get, Post } from "@/services/http-service";
import { TPet } from "@/types";

export interface CaregiverPetContextValues {
  setAsFavourite: (_input: { petId: TPet["id"]; isFavourite: boolean }) => void;
  isSettingAsFavourite: boolean;
  getPet: (_petId: string) => void;
  isLoadingPet: boolean;
  pet: TPet;
}

export const CaregiverPetContext =
  createContext<CaregiverPetContextValues | null>(null);

export interface CaregiverPetProviderProps {
  children: ReactNode;
}

const CaregiverPetProvider = ({ children }: CaregiverPetProviderProps) => {
  const [petId, setPetId] = useState<TPet["id"]>();
  const queryClient = useQueryClient();

  const onError = (err: Error) => {
    console.log(err);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "An unexpected error occurred. Please try again.",
    });
  };

  let { data: pet, isLoading: isLoadingPet } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => Get(`/v2/caregivers/pets/${petId}`),
    enabled: !!petId,
  });

  const { mutate: setAsFavourite, isPending: isSettingAsFavourite } =
    useMutation({
      mutationFn: ({
        petId,
        isFavourite,
      }: {
        petId: TPet["id"];
        isFavourite: boolean;
      }) =>
        Post(`/v2/caregivers/pets/${petId}/favourites`, {
          isFavourite,
        }),
      onSuccess: async () => {
        const queryKeys = [
          ["/care-givers/favourites/pets"],
          ["booking"],
          ["pet", petId],
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

  const getPet = (petId: string) => {
    setPetId(petId);
  };

  return (
    <CaregiverPetContext.Provider
      value={{
        setAsFavourite,
        isSettingAsFavourite,
        getPet,
        isLoadingPet,
        pet,
      }}
    >
      {children}
    </CaregiverPetContext.Provider>
  );
};

export default CaregiverPetProvider;

export const useCaregiverPet = () => {
  const pet = useContext(CaregiverPetContext);

  if (!pet) {
    throw new Error(
      "Cannot access useCaregiverPet outside CaregiverPetProvider"
    );
  }
  return pet;
};
