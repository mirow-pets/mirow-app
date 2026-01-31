import React, { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";
import * as BaseImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { primaryColor } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUploadImage } from "@/hooks/use-upload-image";

import { ImagePicker } from "./ImagePicker";

export interface ImageUploadProps {
  trigger: ReactNode;
  onChange?: (_filePath: string) => void;
  onImage?: (_image?: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const ImageUpload = ({
  trigger,
  style,
  onChange,
  onImage,
}: ImageUploadProps) => {
  const primaryColor = useThemeColor({}, "primary");
  const [isLoading, setIsLoading] = useState(false);

  const { upload, isUploading } = useUploadImage({
    onSuccess: onChange,
    onError: (error) => {
      setIsLoading(false);

      onImage?.(undefined);
      console.log("uploadImage error", error);

      Toast.show({
        type: "error",
        text1: "Uploading image error",
        text2: "Something went wrong, try again!",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const imageComponent = (
    <View style={{ flexShrink: 1, position: "relative" }}>
      <View style={[styles.container, style]}>
        {trigger}
        {(isLoading || isUploading) && (
          <View style={[styles.loaderStyle]}>
            <ActivityIndicator size={20} color={primaryColor} />
            <Text style={styles.textStyle}>Loading..</Text>
          </View>
        )}
      </View>
      <Feather name="camera" size={12} color="black" style={styles.editIcon} />
    </View>
  );

  const handleSelect = async (image: BaseImagePicker.ImagePickerAsset) => {
    console.log("uri", image.uri);
    onImage?.(image.uri);
    upload(image);
  };

  return (
    <View style={styles.container}>
      <ImagePicker trigger={imageComponent} onSelect={handleSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  textStyle: {
    fontSize: 10,
    color: primaryColor,
    textAlign: "center",
  },
  loaderStyle: {
    borderWidth: 1,
    borderColor: primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: "100%",
    maxHeight: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    width: "100%",
  },
  editIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 4,
    borderWidth: 1,
    borderColor: "gray",
  },
  image: {
    backgroundColor: "gray",
    width: "100%",
    height: "100%",
  },
});
