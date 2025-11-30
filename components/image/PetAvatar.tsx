import { ENV } from "@/env";

import { Image } from "./Image";

const placeholderImage = require("@/assets/images/placeholder-dog.png");

export interface PetAvatarProps {
  src?: string;
  size?: number;
  isEditable?: boolean;
  onChange?: (_filePath: string) => void;
}

export const PetAvatar = ({
  src,
  size = 40,
  isEditable,
  onChange,
}: PetAvatarProps) => {
  let imagePath = src;

  if (src && !src.startsWith("http")) {
    imagePath = `${ENV.IMAGE_BASE_URL}${src}`;
  }

  return (
    <Image
      source={imagePath ? { uri: imagePath } : placeholderImage}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      isEditable={isEditable}
      onChange={onChange}
    />
  );
};
