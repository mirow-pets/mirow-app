import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TAddPet, TEditPet } from "@/features/pets/validations";
import { Delete, Get, Patch, Post } from "@/services/http-service";
import { TPet } from "@/types";
import { TPetType, TPetVaccination, TPetWeight } from "@/types/pets";
import { replaceNullWithUndefined } from "@/utils";

import { useAuth } from "../use-auth";

interface Option {
  label: string;
  value?: string | number | boolean;
}

interface TPetFormFields {
  petTypes: TPetType[];
  petWeights: TPetWeight[];
}

export interface PetOwnerPetContextValues {
  pets: TPet[];
  isLoadingPets: boolean;
  isLoadingPetFormFields: boolean;
  addPet: (_input: TAddPet) => void;
  editPet: (_input: TEditPet) => void;
  isAddingPet: boolean;
  isEditingPet: boolean;
  getPet: (_petId: string) => void;
  getPetType: (_petTypeId: number) => TPetType | undefined;
  deletePet: (_petId: string) => void;
  isDeletingPet: boolean;
  pet: TPet;
  isLoadingPet: boolean;
  petTypeOptions: Option[];
  genderOptions: Option[];
  weightOptions: Option[];
  spayedOrNeuteredOptions: Option[];
  petTypes: TPetType[];
}

export const PetOwnerPetContext =
  createContext<PetOwnerPetContextValues | null>(null);

export interface PetOwnerPetProviderProps {
  children: ReactNode;
}

const PetOwnerPetProvider = ({ children }: PetOwnerPetProviderProps) => {
  const { currUser } = useAuth();
  const router = useRouter();
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

  const { data: petFormFields, isLoading: isLoadingPetFormFields } =
    useQuery<TPetFormFields>({
      queryKey: ["pet-fields"],
      queryFn: () => Get("/fields/users/pets"),
      enabled: !!currUser,
    });

  const {
    data: pets = [],
    isLoading: isLoadingPets,
    refetch: refetchPets,
  } = useQuery<TPet[]>({
    queryKey: ["pets", currUser?.sessionId],
    queryFn: () => Get("/users/pets"),
    enabled: !!currUser,
  });

  let {
    data: pet,
    isLoading: isLoadingPet,
    refetch: refetchPet,
  } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => Get(`/users/pets/${petId}`),
    enabled: !!petId,
  });

  const { mutate: add, isPending: isAddingPet } = useMutation<
    TPet,
    Error,
    TAddPet
  >({
    mutationFn: (input: TAddPet) => Post("/users/pets", input),
    onSuccess: async () => {
      await Promise.all([
        refetchPets(),
        queryClient.refetchQueries({
          queryKey: ["pet-owner-completion", currUser?.sessionId],
        }),
      ]);

      router.replace("/pet-owner/pets");

      Toast.show({
        type: "success",
        text1: "Pet added successfully!",
      });
    },
    onError,
  });

  const { mutate: edit, isPending: isEditingPet } = useMutation<
    TPet,
    Error,
    TEditPet
  >({
    mutationFn: ({ petId, ...input }: TEditPet) =>
      Patch(`/users/pets/${petId}`, input),
    onSuccess: async () => {
      await refetchPets();
      await refetchPet();
      await queryClient.refetchQueries({ queryKey: ["/v2/users/pets"] });

      router.back();

      Toast.show({
        type: "success",
        text1: "Pet edited successfully!",
      });
    },
    onError,
  });

  const { mutate: del, isPending: isDeletingPet } = useMutation({
    mutationFn: (petId: TPet["id"]) => Delete(`/users/pets/${petId}`),
    onSuccess: () => {
      refetchPets();
      router.replace("/pet-owner/pets");
    },
    onError,
  });

  const petTypeOptions =
    petFormFields?.petTypes?.map(({ display, id }) => ({
      label: display,
      value: id,
    })) ?? [];

  const genderOptions = [
    {
      label: "Male",
      value: true,
    },
    {
      label: "Female",
      value: true,
    },
    {
      label: "Unknown",
      value: undefined,
    },
  ];

  const weightOptions =
    petFormFields?.petWeights?.map(({ weightType, weightRange, id }) => ({
      label: `${weightType} (${weightRange})`,
      value: id,
    })) ?? [];

  const spayedOrNeuteredOptions = [
    {
      label: "Spayed or neutered",
      value: true,
    },
    {
      label: "Not spayed or neutered",
      value: true,
    },
    {
      label: "Not sure if spayed or neutered",
      value: undefined,
    },
  ];

  const addPet = (input: TAddPet) => add(input);

  const editPet = (input: TEditPet) => edit(replaceNullWithUndefined(input));

  const deletePet = (petId: TPet["id"]) => del(petId);

  const getPet = (petId: string) => {
    setPetId(petId);
  };
  const getPetType = (petTypeId: number) =>
    petFormFields?.petTypes.find(({ id }) => id === petTypeId);

  pet = pet && {
    ...pet,
    petVaccinations: pet.petVaccinations?.map((item: TPetVaccination) => ({
      ...item,
      vaccinatedAt: new Date(item.vaccinatedAt),
      nextDueDate: new Date(item.nextDueDate),
    })),
  };

  return (
    <PetOwnerPetContext.Provider
      value={{
        petTypeOptions,
        petTypes: petFormFields?.petTypes ?? [],
        genderOptions,
        weightOptions,
        spayedOrNeuteredOptions,
        pets,
        isLoadingPets,
        isLoadingPetFormFields,
        addPet,
        isAddingPet,
        getPet,
        getPetType,
        editPet,
        isEditingPet,
        deletePet,
        isDeletingPet,
        pet,
        isLoadingPet,
      }}
    >
      {children}
    </PetOwnerPetContext.Provider>
  );
};

export default PetOwnerPetProvider;

export const usePetOwnerPet = () => {
  const pet = useContext(PetOwnerPetContext);

  if (!pet) {
    throw new Error("Cannot access usePetOwnerPet outside PetOwnerPetProvider");
  }
  return pet;
};
