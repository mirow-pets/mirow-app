import Color from "color";

export function getContrastColor(hexColor: string) {
  const color = Color(hexColor);
  return color.isDark() ? "#FFFFFF" : "#000000";
}
