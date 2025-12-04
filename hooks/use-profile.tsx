import { createContext, ReactNode, useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { TUpdateCaregiverProfile } from "@/features/profile/validations";
import { Get, Patch } from "@/services/http-service";
import {
  TCaregiver,
  TCaregiverPreference,
  TCaregiverProfileCompletion,
  TCaregiverSkill,
  TOption,
} from "@/types";
import { UserRole } from "@/types/users";

import { useAuth } from "./use-auth";

interface TCaregiverProfileFormFields {
  careGiverPreferences: TCaregiverPreference[];
  careGiverSkills: TCaregiverSkill[];
}

export interface ProfileContextValues {
  isLoadingCaregiverProfileFormFields: boolean;
  caregiverProfile: TCaregiver;
  isLoadingCaregiverProfile: boolean;
  caregiverProfileCompletion: TCaregiverProfileCompletion;
  isLoadingCaregiverProfileCompletion: boolean;
  updateCaregiverProfile: (
    _input: TUpdateCaregiverProfile,
    _onSuccess?: () => void
  ) => void;
  isUpdatingCaregiverProfile: boolean;
  caregiverPreferenceOptions: TOption[];
  careGiverSkillOptions: TOption[];
}

export const ProfileContext = createContext<ProfileContextValues | null>(null);

export interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { currUser, userRole } = useAuth();
  const isPetOwner = userRole === UserRole.PetOwner;
  const queryClient = useQueryClient();

  const onError = (err: Error) => {
    console.log(err);
    Toast.show({
      type: "error",
      text1: "An unexpected error occurred. Please try again.",
    });
  };

  const {
    data: caregiverProfileFormFields = {
      serviceTypes: [],
      petTypes: [],
      homeTypes: [],
      careGiverPreferences: [],
      careGiverSkills: [],
    },
    isLoading: isLoadingCaregiverProfileFormFields,
  } = useQuery<TCaregiverProfileFormFields>({
    queryKey: ["caregiver-profile-fields"],
    queryFn: () => Get("/fields/care-givers/profile"),
    enabled: !!currUser && !isPetOwner,
  });

  const { data: caregiverProfile, isLoading: isLoadingCaregiverProfile } =
    useQuery({
      queryKey: ["caregiver-profile"],
      queryFn: () => Get(`/caregivers`),
      enabled: !!currUser && !isPetOwner,
    });

  const {
    data: caregiverProfileCompletion,
    isLoading: isLoadingCaregiverProfileCompletion,
  } = useQuery({
    queryKey: ["caregiver-profile-completion"],
    queryFn: () => Get(`/care-givers/profile-completion`),
    enabled: !!currUser && !isPetOwner,
  });

  const {
    mutate: _updateCaregiverProfile,
    isPending: isUpdatingCaregiverProfile,
  } = useMutation({
    mutationFn: (input: TUpdateCaregiverProfile) =>
      Patch(`/care-givers`, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["caregiver-profile"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["caregiver-profile-completion"],
      });

      Toast.show({
        type: "success",
        text1: "Caregiver profile updated successfully!",
      });
    },
    onError,
  });

  const updateCaregiverProfile = (
    input: TUpdateCaregiverProfile,
    onSuccess?: () => void
  ) => _updateCaregiverProfile(input, { onSuccess });

  const caregiverPreferenceOptions =
    caregiverProfileFormFields.careGiverPreferences.map(
      ({ preference, id }) => ({
        label: preference,
        value: id,
      })
    );

  const careGiverSkillOptions = caregiverProfileFormFields.careGiverSkills.map(
    ({ skill, id }) => ({
      label: skill,
      value: id,
    })
  );

  return (
    <ProfileContext.Provider
      value={{
        caregiverProfile,
        isLoadingCaregiverProfile,
        caregiverProfileCompletion,
        isLoadingCaregiverProfileCompletion,
        updateCaregiverProfile,
        isUpdatingCaregiverProfile,
        caregiverPreferenceOptions,
        careGiverSkillOptions,
        isLoadingCaregiverProfileFormFields,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;

export const useProfile = () => {
  const profile = useContext(ProfileContext);

  if (!profile) {
    throw new Error("Cannot access useProfile outside ProfileProvider");
  }
  return profile;
};
