import React, { useState } from "react";
import {
  ActivityIndicator,
  Image as BaseImage,
  ImageProps as BaseImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { Modal } from "@/components/modal/Modal";
import { ThemedView } from "@/components/themed-view";
import { useModal } from "@/hooks/use-modal";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Post } from "@/services/http-service";

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
  const { setOpenId } = useModal();

  const imageComponent = (
    <View>
      {isLoading ? (
        <View style={[styles.loaderStyle, style]}>
          <ActivityIndicator size={20} color={primaryColor} />
          <Text style={styles.textStyle}>Loading..</Text>
        </View>
      ) : (
        <BaseImage
          source={image ? { uri: image } : source}
          style={style}
          onLoad={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          {...rest}
        />
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

  const handleProfileFromDevice = async (
    image: ImagePicker.ImagePickerAsset
  ) => {
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

  const pickImage = async (type: "camera" | "gallery") => {
    setOpenId("");

    if (type === "camera") {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission required",
          text2: "Permission to access the camera is required.",
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImage(asset.uri);
        setOpenId("");
        await handleProfileFromDevice(asset);
      }
    } else {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission required",
          text2: "Permission to access the media library is required.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImage(asset.uri);
        await handleProfileFromDevice(asset);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        id="select-source"
        title="Select source"
        trigger={imageComponent}
        style={{ width: 300 }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            gap: 32,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", gap: 8 }}
            onPress={() => pickImage("camera")}
          >
            <Feather name="camera" size={48} color="black" />
            <Text>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", gap: 8 }}
            onPress={() => pickImage("gallery")}
          >
            <Entypo name="images" size={48} color="black" />
            <Text>Gallery</Text>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  textStyle: {
    fontSize: 10,
    color: "#949494",
    textAlign: "center",
  },
  loaderStyle: {
    borderWidth: 1,
    borderColor: "#0d99ff",
    alignItems: "center",
    justifyContent: "center",
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
});
