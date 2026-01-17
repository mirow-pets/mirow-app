import { createContext, ReactNode, useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { TUpdatePetOwnerProfile } from "@/features/profile/validations";
import { useAuth } from "@/hooks/use-auth";
import { Get, Patch } from "@/services/http-service";
import {
  TCaregiverPreference,
  TCaregiverSkill,
  THomeType,
  TOption,
  TPetOwnerProfileCompletion,
  TServiceType,
  TTransportType,
} from "@/types";
import { TPetType } from "@/types/pets";
import { TAuthUser } from "@/types/users";
import { onError } from "@/utils";

interface TPetOwnerProfileFormFields {
  careGiverPreferences: TCaregiverPreference[];
  careGiverSkills: TCaregiverSkill[];
  serviceTypes: TServiceType[];
  petTypes: TPetType[];
  homeTypes: THomeType[];
  transportType: TTransportType[];
}

export interface PetOwnerProfileContextValues {
  profile?: TAuthUser;
  isLoadingProfile: boolean;
  profileCompletion: TPetOwnerProfileCompletion;
  isLoadingProfileCompletion: boolean;
  updateProfile: (
    _input: TUpdatePetOwnerProfile,
    _onSuccess?: () => void
  ) => void;
  isUpdatingProfile: boolean;
  petOwnerProfileFormFields: TPetOwnerProfileFormFields;
  isLoadingPetOwnerProfileFormFields: boolean;
  caregiverPreferenceOptions: TOption[];
  caregiverSkillOptions: TOption[];
  serviceTypeOptions: TOption[];
  petTypeOptions: TOption[];
  homeTypeOptions: TOption[];
  transportationTypeOptions: TOption[];
}

export const PetOwnerProfileContext =
  createContext<PetOwnerProfileContextValues | null>(null);

export interface PetOwnerProfileProviderProps {
  children: ReactNode;
}

const PetOwnerProfileProvider = ({
  children,
}: PetOwnerProfileProviderProps) => {
  const { currUser, logout } = useAuth();

  const queryClient = useQueryClient();

  const {
    data: petOwnerProfileFormFields = {
      careGiverPreferences: [],
      careGiverSkills: [],
      serviceTypes: [],
      petTypes: [],
      homeTypes: [],
      transportType: [],
    },
    isLoading: isLoadingPetOwnerProfileFormFields,
  } = useQuery<TPetOwnerProfileFormFields>({
    queryKey: ["pet-owner-profile-fields"],
    queryFn: () => Get("/fields/users/filters"),
    enabled: !!currUser,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery<TAuthUser>({
    queryKey: ["pet-owner-profile", currUser?.sessionId],
    queryFn: () => Get(`/users`),
    enabled: !!currUser,
    meta: {
      onError: () => {
        logout();
        router.replace("/");
      },
    },
  });

  const { data: profileCompletion, isLoading: isLoadingProfileCompletion } =
    useQuery({
      queryKey: ["pet-owner-completion", currUser?.sessionId],
      queryFn: () => Get(`/users/profile-completion`),
      enabled: !!currUser,
    });

  const { mutate: _updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (input: TUpdatePetOwnerProfile) => Patch(`/users`, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pet-owner-profile", currUser?.sessionId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["pet-owner-completion", currUser?.sessionId],
      });

      Toast.show({
        type: "success",
        text1: "Profile updated successfully!",
      });
    },
    onError,
  });

  const updateProfile = (
    input: TUpdatePetOwnerProfile,
    onSuccess?: () => void
  ) => _updateProfile(input, { onSuccess });

  const caregiverPreferenceOptions =
    petOwnerProfileFormFields.careGiverPreferences.map(
      ({ preference, id }) => ({
        label: preference,
        value: id,
      })
    );

  const caregiverSkillOptions = petOwnerProfileFormFields.careGiverSkills.map(
    ({ skill, id }) => ({
      label: skill,
      value: id,
    })
  );

  const serviceTypeOptions = petOwnerProfileFormFields.serviceTypes.map(
    ({ display, id }) => ({
      label: display,
      value: id,
    })
  );

  const petTypeOptions = petOwnerProfileFormFields.petTypes.map(
    ({ display, id }) => ({
      label: display,
      value: id,
    })
  );

  const homeTypeOptions = petOwnerProfileFormFields.homeTypes.map(
    ({ display, id }) => ({
      label: display,
      value: id,
    })
  );

  const transportationTypeOptions = petOwnerProfileFormFields.transportType.map(
    ({ display, id }) => ({
      label: display,
      value: id,
    })
  );

  return (
    <PetOwnerProfileContext.Provider
      value={{
        profile,
        isLoadingProfile,
        profileCompletion,
        isLoadingProfileCompletion,
        updateProfile,
        isUpdatingProfile,
        petOwnerProfileFormFields,
        isLoadingPetOwnerProfileFormFields,
        caregiverPreferenceOptions,
        caregiverSkillOptions,
        serviceTypeOptions,
        petTypeOptions,
        homeTypeOptions,
        transportationTypeOptions,
      }}
    >
      {children}
    </PetOwnerProfileContext.Provider>
  );
};

export default PetOwnerProfileProvider;

export const usePetOwnerProfile = () => {
  const profile = useContext(PetOwnerProfileContext);

  if (!profile) {
    throw new Error(
      "Cannot access usePetOwnerProfile outside PetOwnerProfileProvider"
    );
  }
  return profile;
};
