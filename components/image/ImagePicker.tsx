import React, { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import * as BaseImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { Modal } from "@/components/modal/Modal";
import { ThemedView } from "@/components/themed-view";
import { useModal } from "@/hooks/use-modal";

export interface ImagePickerProps {
  trigger: ReactNode;
  disabled?: boolean;
  onSelect: (_image: BaseImagePicker.ImagePickerAsset) => void;
}

export const ImagePicker = ({
  trigger,
  disabled,
  onSelect,
}: ImagePickerProps) => {
  const { setOpenId } = useModal();

  const pickImage = async (type: "camera" | "gallery") => {
    setOpenId("");

    if (type === "camera") {
      const permissionResult =
        await BaseImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission required",
          text2: "Permission to access the camera is required.",
        });
        return;
      }

      const result = await BaseImagePicker.launchCameraAsync({
        cameraType: BaseImagePicker.CameraType.back,
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setOpenId("");
        onSelect(asset);
      }
    } else {
      const permissionResult =
        await BaseImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission required",
          text2: "Permission to access the media library is required.",
        });
        return;
      }

      const result = await BaseImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        onSelect(asset);
      }
    }
  };

  return (
    <Modal
      id="select-source"
      title="Select source"
      trigger={trigger}
      style={{ width: 300 }}
      disabled={disabled}
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
  );
};
