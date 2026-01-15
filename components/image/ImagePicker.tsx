import React, { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import * as BaseImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { Modal } from "@/components/modal/Modal";
import { useModal } from "@/hooks/use-modal";
import { randomUUID } from "@/utils";

import type { PermissionResponse } from "expo-modules-core";

const requestPermission = async (
  getPermission: () => Promise<PermissionResponse>,
  requestPermissionFunc: () => Promise<PermissionResponse>,
  permissionType: string
) => {
  let permissionResult = await getPermission();

  if (!permissionResult.granted) {
    // if (permissionResult.canAskAgain) {
    permissionResult = await requestPermissionFunc();

    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: "Permission required",
        text2: `Permission to access the ${permissionType} is required.`,
      });
      return false;
    }
    // } else {
    //   Toast.show({
    //     type: "error",
    //     text1: "Permission required",
    //     text2: `Permission to access the ${permissionType} is required. Please enable it in your device settings.`,
    //   });
    //   return false;
    // }
  }
  return true;
};

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
      const hasPermission = await requestPermission(
        BaseImagePicker.getCameraPermissionsAsync,
        BaseImagePicker.requestCameraPermissionsAsync,
        "camera"
      );
      console.log("Camera Permission Result:", hasPermission); // Added log
      if (!hasPermission) {
        return;
      }

      const result = await BaseImagePicker.launchCameraAsync({
        cameraType: BaseImagePicker.CameraType.back,
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      console.log("Camera Launch Result:", result); // Added log

      if (!result.canceled) {
        const asset = result.assets[0];
        setOpenId("");
        onSelect(asset);
      }
    } else {
      const hasPermission = await requestPermission(
        BaseImagePicker.getMediaLibraryPermissionsAsync,
        BaseImagePicker.requestMediaLibraryPermissionsAsync,
        "media library"
      );
      console.log("Media Library Permission Result:", hasPermission); // Added log

      if (!hasPermission) {
        return;
      }

      // Temporarily remove setOpenId("") here for testing on iOS
      // setOpenId("");

      const result = await BaseImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      console.log("Media Library Launch Result:", result); // Added log

      if (!result.canceled) {
        const asset = result.assets[0];
        onSelect(asset);
      }
    }
  };

  return (
    <Modal
      id={`select-source-${randomUUID()}`}
      title="Select source"
      trigger={trigger}
      style={{ width: 300 }}
      disabled={disabled}
    >
      <View
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
      </View>
    </Modal>
  );
};
