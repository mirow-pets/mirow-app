
import { Platform, StatusBar } from "react-native";

// Use Constants if available, otherwise fallback to StatusBar.currentHeight
export const getStatusBarHeight = () => {
  if (Platform.OS === "ios") {
    // iOS will automatically respect the safe area, but fall back to 44 for notched devices
    return 44;
  } else {
    // Android
    return StatusBar.currentHeight ?? 24;
  }
};
