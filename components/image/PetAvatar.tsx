import { StyleProp } from "react-native";

import { Image, ImageStyle } from "expo-image";

import { ENV } from "@/env";

const placeholderImage = require("@/assets/images/placeholder-dog.png");

export interface PetAvatarProps {
  src?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const PetAvatar = ({ src, size = 40, style }: PetAvatarProps) => {
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
          borderWidth: 0,
        },
        style,
      ]}
    />
  );
};
