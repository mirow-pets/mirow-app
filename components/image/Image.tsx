import React, { useState } from "react";
import {
  ActivityIndicator,
  Image as BaseImage,
  ImageProps as BaseImageProps,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";
import * as BaseImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { primaryColor } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Post } from "@/services/http-service";

import { ImagePicker } from "./ImagePicker";

export interface ImageProps extends BaseImageProps {
  isEditable?: boolean;
  onChange?: (_filePath: string) => void;
}

export const Image = ({
  isEditable,
  source,
  style,
  onChange,
  ...rest
}: ImageProps) => {
  const primaryColor = useThemeColor({}, "primary");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const imageComponent = (
    <View style={styles.container}>
      {source ? (
        <BaseImage
          source={image ? { uri: image } : source}
          style={[styles.image, style]}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          {...rest}
        />
      ) : (
        <View style={[styles.image, style]}>
          <View
            style={{
              backgroundColor: "#aaaaaa",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Feather name="camera" size={32} color="black" />
          </View>
        </View>
      )}
      {isLoading && (
        <View style={[styles.loaderStyle, style]}>
          <ActivityIndicator size={20} color={primaryColor} />
          <Text style={styles.textStyle}>Loading..</Text>
        </View>
      )}
      {isEditable && (
        <Feather
          name="camera"
          size={12}
          color="black"
          style={styles.editIcon}
        />
      )}
    </View>
  );

  if (!isEditable) return imageComponent;

  const handleSelect = async (image: BaseImagePicker.ImagePickerAsset) => {
    setImage(image.uri);
    const formdata = new FormData();

    const splitFileName = image.fileName?.split(".") ?? [];

    formdata.append("image", {
      uri: image.uri,
      name: image.fileName ?? "",
      type: `image/${splitFileName[splitFileName.length - 1]}`,
    } as unknown as File);

    try {
      setIsLoading(true);
      const result = await Post(
        "/upload/image",
        formdata,
        "multipart/form-data"
      );
      if (result?.image) onChange?.(result.image);
    } catch (error) {
      console.log("uploadImage error", error);
      Toast.show({
        type: "error",
        text1: "Uploading image error",
        text2: "Something went wrong, try again!",
      });
    } finally {
      setIsLoading(false);
    }
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
    flexDirection: "row",
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
    height: "100%",
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
  },
});
