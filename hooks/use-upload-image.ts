import { Platform } from "react-native";

import { useMutation } from "@tanstack/react-query";
import * as BaseImagePicker from "expo-image-picker";

import { Post } from "@/services/http-service";

export interface UseUploadImageProps {
  onSuccess?: (_filePat: string) => void;
  onError?: (_error: Error) => void;
  onSettled?: () => void;
}

export const useUploadImage = (props?: UseUploadImageProps) => {
  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: async (image: BaseImagePicker.ImagePickerAsset) => {
      const formdata = new FormData();

      const splitFileName = image.fileName?.split(".") ?? [];

      formdata.append(
        "image",
        image.file ??
          ({
            uri: image.uri,
            name: image.fileName ?? "",
            type: `image/${splitFileName[splitFileName.length - 1]}`,
          } as unknown as File)
      );

      const result = await Post(
        "/upload/image",
        formdata,
        Platform.OS !== "web" ? "multipart/form-data" : ""
      );
      return result?.image;
    },
    onSuccess: props?.onSuccess,
    onError: props?.onError,
    onSettled: props?.onSettled,
  });

  return { upload, isUploading };
};
