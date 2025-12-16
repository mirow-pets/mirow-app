import { createContext, ReactNode, useContext } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { TUpdatePetOwnerProfile } from "@/features/profile/validations";
import { useAuth } from "@/hooks/use-auth";
import { Get, Patch } from "@/services/http-service";
import { TPetOwnerProfileCompletion } from "@/types";
import { TAuthUser } from "@/types/users";

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

  const onError = (err: Error) => {
    console.log(err);
    let message = "An unexpected error occurred. Please try again.";

    if ("statusCode" in err && Number(err.statusCode) < 500) {
      message = err.message;
    }

    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
    });
  };

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

  return (
    <PetOwnerProfileContext.Provider
      value={{
        profile,
        isLoadingProfile,
        profileCompletion,
        isLoadingProfileCompletion,
        updateProfile,
        isUpdatingProfile,
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
