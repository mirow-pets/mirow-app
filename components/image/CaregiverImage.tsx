import { DimensionValue } from "react-native";

import { ENV } from "@/env";

import { Image } from "./Image";

const placeholderImage = require("@/assets/images/placeholder-dog.png");

export interface CaregiverImageProps {
  src?: string;
  size?: DimensionValue;
  isEditable?: boolean;
  onChange?: (_filePath: string) => void;
}

export const CaregiverImage = ({
  src,
  size = 40,
  isEditable,
  onChange,
}: CaregiverImageProps) => {
  let imagePath = src;

  if (src && !src.startsWith("http")) {
    imagePath = `${ENV.IMAGE_BASE_URL}${src}`;
  }

  return (
    <Image
      source={imagePath ? { uri: imagePath } : placeholderImage}
      style={{
        width: size,
        height: size,
      }}
      isEditable={isEditable}
      onChange={onChange}
    />
  );
};
