import { ENV } from "@/env";

import { Image } from "./Image";

export interface DocumentImageProps {
  src?: string;
  height: number;
  width: number;
  isEditable?: boolean;
  onChange?: (_filePath: string) => void;
}

export const DocumentImage = ({
  src,
  height,
  width,
  isEditable,
  onChange,
}: DocumentImageProps) => {
  let imagePath = src;

  if (src && !src.startsWith("http")) {
    imagePath = `${ENV.IMAGE_BASE_URL}${src}`;
  }

  return (
    <Image
      source={imagePath ? { uri: imagePath } : undefined}
      style={{ width, height }}
      isEditable={isEditable}
      onChange={onChange}
    />
  );
};
