import { StyleProp } from "react-native";

import { ImageStyle } from "expo-image";

import { ENV } from "@/env";

import { Image } from "./Image";

const placeholderImage = require("@/assets/images/placeholder-avatar.png");

export interface UserAvatarEditableProps {
  src?: string;
  size?: number;
  onChange?: (_filePath: string) => void;
  style?: StyleProp<ImageStyle>;
}

export const UserAvatarEditable = ({
  src,
  size = 40,
  onChange,
  style,
}: UserAvatarEditableProps) => {
  let imagePath = src;

  if (src && !src.startsWith("http")) {
    imagePath = `${ENV.IMAGE_BASE_URL}${src}`;
  }

  return (
    <Image
      source={imagePath ? { uri: imagePath } : placeholderImage}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
        },
        style,
      ]}
      isEditable
      onChange={onChange}
    />
  );
};
