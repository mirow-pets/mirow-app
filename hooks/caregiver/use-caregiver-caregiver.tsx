import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as BaseImagePicker from "expo-image-picker";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { TCreateCheckrCandidate } from "@/features/profile/validations";
import { TBackgroundVerification } from "@/features/profile/validations/background-verification-schema";
import { useAuth } from "@/hooks/use-auth";
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
import { TSetting } from "@/types/settings";
import { onError } from "@/utils";

interface TCaregiverSignupFormFields {
  documentTypes: TDocument[];
  serviceTypes: TServiceType[];
  petTypes: TPetType[];
  homeTypes: THomeType[];
  transportTypes: TTransportType[];
  settings: TSetting[];
}

export interface CaregiverCaregiverContextValues {
  getCaregiver: (_caregiverId: string) => void;
  isLoadingCaregiverSignupFormFields: boolean;
  serviceTypes: TServiceType[];
  petTypeOptions: TOption[];
  documentTypeOptions: TOption[];
  serviceTypeOptions: TOption[];
  homeTypeOptions: TOption[];
  transportTypeOptions: TOption[];
  caregiverGalleries: TCaregiverGallery[];
  isLoadingCaregiverGalleries: boolean;
  uploadImage: (_image: BaseImagePicker.ImagePickerAsset) => void;
  isUploadingImage: boolean;
  initiateBackgroundVerification: (
    _input: TBackgroundVerification,
    _onSuccess: () => void
  ) => void;
  isInitiatingBackgroundVerification: boolean;
  createCheckrCandidate: (_input: TCreateCheckrCandidate) => void;
  isCreatingCheckrCandidate: boolean;
  settings: Record<string, string>;
}

export const CaregiverCaregiverContext =
  createContext<CaregiverCaregiverContextValues | null>(null);

export interface CaregiverCaregiverProviderProps {
  children: ReactNode;
}

const CaregiverCaregiverProvider = ({
  children,
}: CaregiverCaregiverProviderProps) => {
  const { currUser } = useAuth();
  const [userId, setUserId] = useState<TCaregiver["usersId"]>();
  const queryClient = useQueryClient();

  const {
    data: caregiverSignupFormFields,
    isLoading: isLoadingCaregiverSignupFormFields,
  } = useQuery<TCaregiverSignupFormFields>({
    queryKey: ["caregiver-signup-fields"],
    queryFn: () => Get("/fields/caregivers/signup"),
    enabled: !!currUser,
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

  const settings = useMemo(() => {
    const mapper: Record<string, string> = {};
    if (!caregiverSignupFormFields?.settings) return {};
    caregiverSignupFormFields.settings.forEach(({ settings, value }) => {
      mapper[settings] = value;
    });
    return mapper;
  }, [caregiverSignupFormFields?.settings]);

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
      const queryKeys = [
        ["caregiver-galleries", userId],
        ["caregiver-profile"],
        ["caregiver-profile-completion"],
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
        text1: "Image uploaded successfully!",
      });
    },
    onError,
  });

  const {
    mutate: _initiateBackgroundVerification,
    isPending: isInitiatingBackgroundVerification,
  } = useMutation<unknown, Error, TBackgroundVerification>({
    mutationFn: ({ dateOfBirth, ...input }) => {
      return Patch("/initiate-background-check", {
        ...input,
        day: dateOfBirth.getDate(),
        month: dateOfBirth.getMonth() + 1,
        year: dateOfBirth.getFullYear(),
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["caregiver-profile", currUser?.sessionId],
      });
    },
    onError,
  });

  const {
    mutate: createCheckrCandidate,
    isPending: isCreatingCheckrCandidate,
  } = useMutation<unknown, Error, TCreateCheckrCandidate>({
    mutationFn: ({ dateOfBirth, ...input }: TCreateCheckrCandidate) => {
      return Post("/checkr/create-candidate", {
        ...input,
        day: dateOfBirth.getDate(),
        month: dateOfBirth.getMonth() + 1,
        year: dateOfBirth.getFullYear(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["caregiver-profile"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["caregiver-profile-completion"],
      });

      router.push("/caregiver/profile");

      Toast.show({
        type: "success",
        text1: "Background check started successfully!",
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

  const initiateBackgroundVerification = (
    input: TBackgroundVerification,
    onSuccess: () => void
  ) => _initiateBackgroundVerification(input, { onSuccess });

  return (
    <CaregiverCaregiverContext.Provider
      value={{
        serviceTypes: caregiverSignupFormFields?.serviceTypes ?? [],
        getCaregiver,
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
        initiateBackgroundVerification,
        isInitiatingBackgroundVerification,
        createCheckrCandidate,
        isCreatingCheckrCandidate,
        settings,
      }}
    >
      {children}
    </CaregiverCaregiverContext.Provider>
  );
};

export default CaregiverCaregiverProvider;

export const useCaregiverCaregiver = () => {
  const caregiver = useContext(CaregiverCaregiverContext);

  if (!caregiver) {
    throw new Error(
      "Cannot access useCaregiverCaregiver outside CaregiverCaregiverProvider"
    );
  }
  return caregiver;
};
