import { createContext, ReactNode, useContext, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { Get, Post } from "@/services/http-service";
import { TCaregiver, TUser } from "@/types";

import { useAuth } from "./use-auth";
import { useModal } from "./use-modal";

export interface CaregiverContextValues {
  caregivers: TCaregiver[];
  isLoadingCaregivers: boolean;
  getCaregiver: (_caregiverId: string) => void;
  caregiver: TCaregiver;
  isLoadingCaregiver: boolean;
}

export const CaregiverContext = createContext<CaregiverContextValues | null>(
  null
);

export interface CaregiverProviderProps {
  children: ReactNode;
}

const CaregiverProvider = ({ children }: CaregiverProviderProps) => {
  const { setOpenId } = useModal();
  const { currUser } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<TCaregiver["usersId"]>();

  const onError = (err: Error) => {
    console.log(err);
    Toast.show({
      type: "error",
      text1: "An unexpected error occurred. Please try again.",
    });
  };

  const {
    data: caregivers = [],
    isLoading: isLoadingCaregivers,
    refetch: refetchCaregivers,
  } = useQuery<TCaregiver[]>({
    queryKey: ["caregivers"],
    queryFn: () => Post("/users/care-givers", {}),
    enabled: !!currUser,
  });

  let {
    data: caregiver,
    isLoading: isLoadingCaregiver,
    refetch: refetchCaregiver,
  } = useQuery({
    queryKey: ["caregiver", userId],
    queryFn: () => Get(`/users/care-givers/${userId}`),
    enabled: !!userId,
  });

  const getCaregiver = (userId: TUser["id"]) => {
    setUserId(userId);
  };

  return (
    <CaregiverContext.Provider
      value={{
        caregivers,
        isLoadingCaregivers,
        getCaregiver,
        caregiver,
        isLoadingCaregiver,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
};

export default CaregiverProvider;

export const useCaregiver = () => {
  const caregiver = useContext(CaregiverContext);

  if (!caregiver) {
    throw new Error("Cannot access useCaregiver outside CaregiverProvider");
  }
  return caregiver;
};
