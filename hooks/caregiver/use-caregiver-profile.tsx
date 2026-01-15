import { createContext, ReactNode, useContext } from "react";

import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { TUpdateCaregiverProfile } from "@/features/profile/validations";
import { Get, Patch } from "@/services/http-service";
import {
  TCaregiverPreference,
  TCaregiverProfileCompletion,
  TCaregiverSkill,
  TOption,
} from "@/types";
import { TAuthCaregiver } from "@/types/caregivers";
import { onError } from "@/utils";

import { useAuth } from "../use-auth";

interface TCaregiverProfileFormFields {
  careGiverPreferences: TCaregiverPreference[];
  careGiverSkills: TCaregiverSkill[];
}

export interface CaregiverProfileContextValues {
  isLoadingCaregiverProfileFormFields: boolean;
  profile: TAuthCaregiver;
  isLoadingProfile: boolean;
  profileCompletion: TCaregiverProfileCompletion;
  isLoadingProfileCompletion: boolean;
  updateProfile: UseMutateFunction<unknown, Error, TUpdateCaregiverProfile>;
  isUpdatingProfile: boolean;
  caregiverPreferenceOptions: TOption[];
  caregiverSkillOptions: TOption[];
}

export const CaregiverProfileContext =
  createContext<CaregiverProfileContextValues | null>(null);

export interface CaregiverProfileProviderProps {
  children: ReactNode;
}

const CaregiverProfileProvider = ({
  children,
}: CaregiverProfileProviderProps) => {
  const { currUser, logout } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: caregiverProfileFormFields = {
      careGiverPreferences: [],
      careGiverSkills: [],
    },
    isLoading: isLoadingCaregiverProfileFormFields,
  } = useQuery<TCaregiverProfileFormFields>({
    queryKey: ["caregiver-profile-fields"],
    queryFn: () => Get("/fields/care-givers/profile"),
    enabled: !!currUser,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["caregiver-profile", currUser?.sessionId],
    queryFn: () => Get(`/caregivers`),
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
      queryKey: ["caregiver-profile-completion", currUser?.sessionId],
      queryFn: () => Get(`/care-givers/profile-completion`),
      enabled: !!currUser,
    });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (input: TUpdateCaregiverProfile) =>
      Patch(`/care-givers`, {
        ...input,
        ...(input.dateOfBirth
          ? {
              day: input.dateOfBirth.getDate(),
              month: input.dateOfBirth.getMonth() + 1,
              year: input.dateOfBirth.getFullYear(),
            }
          : {}),
      }),
    onSuccess: async () => {
      const queryKeys = [
        ["caregiver-profile", currUser?.sessionId],
        ["caregiver-profile-completion", currUser?.sessionId],
      ];

      await Promise.all(
        queryKeys.map((queryKey) =>
          queryClient.refetchQueries({
            queryKey,
          })
        )
      );

      Toast.show({
        type: "success",
        text1: "Caregiver profile updated successfully!",
      });
    },
    onError,
  });

  const caregiverPreferenceOptions =
    caregiverProfileFormFields.careGiverPreferences.map(
      ({ preference, id }) => ({
        label: preference,
        value: id,
      })
    );

  const caregiverSkillOptions = caregiverProfileFormFields.careGiverSkills.map(
    ({ skill, id }) => ({
      label: skill,
      value: id,
    })
  );

  return (
    <CaregiverProfileContext.Provider
      value={{
        profile,
        isLoadingProfile,
        profileCompletion,
        isLoadingProfileCompletion,
        updateProfile,
        isUpdatingProfile,
        caregiverPreferenceOptions,
        caregiverSkillOptions,
        isLoadingCaregiverProfileFormFields,
      }}
    >
      {children}
    </CaregiverProfileContext.Provider>
  );
};

export default CaregiverProfileProvider;

export const useCaregiverProfile = () => {
  const profile = useContext(CaregiverProfileContext);

  if (!profile) {
    throw new Error(
      "Cannot access useCaregiverProfile outside CaregiverProfileProvider"
    );
  }
  return profile;
};
