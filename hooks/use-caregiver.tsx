import { createContext, ReactNode, useContext, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as BaseImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { TBackgroundVerification } from "@/features/profile/validations/background-verification-schema";
import { Get, Patch, Post } from "@/services/http-service";
import {
  TCaregiver,
  TDocument,
  THomeType,
  TOption,
  TServiceType,
  TTransportType,
  TUser,
} from "@/types";
import { TCaregiverGallery } from "@/types/caregivers";
import { TPetType } from "@/types/pets";
import { UserRole } from "@/types/users";

import { useAuth } from "./use-auth";

interface TCaregiverSignupFormFields {
  documentTypes: TDocument[];
  serviceTypes: TServiceType[];
  petTypes: TPetType[];
  homeTypes: THomeType[];
  transportTypes: TTransportType[];
}

export interface CaregiverContextValues {
  caregivers: TCaregiver[];
  isLoadingCaregivers: boolean;
  getCaregiver: (_caregiverId: string) => void;
  caregiver: TCaregiver;
  isLoadingCaregiver: boolean;
  isLoadingCaregiverSignupFormFields: boolean;
  petTypeOptions: TOption[];
  documentTypeOptions: TOption[];
  serviceTypeOptions: TOption[];
  homeTypeOptions: TOption[];
  transportTypeOptions: TOption[];
  caregiverGalleries: TCaregiverGallery[];
  isLoadingCaregiverGalleries: boolean;
  uploadImage: (_image: BaseImagePicker.ImagePickerAsset) => void;
  isUploadingImage: boolean;
  initiateBackgroungVerification: (_input: TBackgroundVerification) => void;
  isInitiatingBackgroundVerification: boolean;
}

export const CaregiverContext = createContext<CaregiverContextValues | null>(
  null
);

export interface CaregiverProviderProps {
  children: ReactNode;
}

const CaregiverProvider = ({ children }: CaregiverProviderProps) => {
  const { currUser, userRole } = useAuth();
  const [userId, setUserId] = useState<TCaregiver["usersId"]>();
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
    data: caregiverSignupFormFields,
    isLoading: isLoadingCaregiverSignupFormFields,
  } = useQuery<TCaregiverSignupFormFields>({
    queryKey: ["pet-fields"],
    queryFn: () => Get("/fields/caregivers/signup"),
    enabled: !!currUser && !isPetOwner,
  });

  const petTypeOptions =
    caregiverSignupFormFields?.petTypes?.map(({ display, id }) => ({
      label: display,
      value: id,
    })) ?? [];

  const documentTypeOptions =
    caregiverSignupFormFields?.documentTypes?.map(({ display, id }) => ({
      label: display,
      value: id,
    })) ?? [];

  const serviceTypeOptions =
    caregiverSignupFormFields?.serviceTypes?.map(({ display, id }) => ({
      label: display,
      value: id,
    })) ?? [];

  const homeTypeOptions =
    caregiverSignupFormFields?.homeTypes?.map(({ display, id }) => ({
      label: display,
      value: id,
    })) ?? [];

  const transportTypeOptions =
    caregiverSignupFormFields?.transportTypes?.map(({ display, id }) => ({
      label: display,
      value: id,
    })) ?? [];

  const { data: caregivers = [], isLoading: isLoadingCaregivers } = useQuery<
    TCaregiver[]
  >({
    queryKey: ["caregivers"],
    queryFn: () => Post("/users/care-givers"),
    enabled: !!currUser && isPetOwner,
  });

  const { data: caregiver, isLoading: isLoadingCaregiver } = useQuery({
    queryKey: ["caregiver", userId, isPetOwner],
    queryFn: () => Get(`/users/care-givers/${userId}`),
    enabled: !!currUser && isPetOwner,
  });

  const {
    data: caregiverGalleries = [],
    isLoading: isLoadingCaregiverGalleries,
  } = useQuery<TCaregiverGallery[]>({
    queryKey: ["caregiver-galleries", userId],
    queryFn: () => Get(`/care-givers/${userId}/galleries`),
    enabled: !!userId,
  });

  const { mutate: _uploadImage, isPending: isUploadingImage } = useMutation<
    void,
    Error,
    FormData
  >({
    mutationFn: (input: FormData) =>
      Post("/care-givers/galleries", input, "multipart/form-data"),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["caregiver-galleries", userId],
      });

      Toast.show({
        type: "success",
        text1: "Image uploaded successfully!",
      });
    },
    onError,
  });

  const getCaregiver = (userId: TUser["id"]) => {
    setUserId(userId);
  };

  const uploadImage = (image: BaseImagePicker.ImagePickerAsset) => {
    const splitFileName = image.fileName?.split(".") ?? [];

    const formdata = new FormData();

    formdata.append("image", {
      uri: image.uri,
      name: image.fileName ?? "",
      type: `image/${splitFileName[splitFileName.length - 1]}`,
    } as unknown as File);

    _uploadImage(formdata);
  };

  const {
    mutate: _initiateBackgroungVerification,
    isPending: isInitiatingBackgroundVerification,
  } = useMutation<unknown, Error, TBackgroundVerification>({
    mutationFn: () => Patch("/initiate-background-check"),
  });

  const initiateBackgroungVerification = (input: TBackgroundVerification) =>
    _initiateBackgroungVerification(input);

  return (
    <CaregiverContext.Provider
      value={{
        caregivers,
        isLoadingCaregivers,
        getCaregiver,
        caregiver,
        isLoadingCaregiver,
        petTypeOptions,
        isLoadingCaregiverSignupFormFields,
        documentTypeOptions,
        serviceTypeOptions,
        homeTypeOptions,
        transportTypeOptions,
        caregiverGalleries,
        isLoadingCaregiverGalleries,
        uploadImage,
        isUploadingImage,
        initiateBackgroungVerification,
        isInitiatingBackgroundVerification,
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
