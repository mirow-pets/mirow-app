import { Platform } from "react-native";

let apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL!;

if (Platform.OS === "android") {
  apiBaseUrl = process.env.EXPO_PUBLIC_API_ANDROID_BASE_URL ?? apiBaseUrl;
} else if (Platform.OS === "ios") {
  apiBaseUrl = process.env.EXPO_PUBLIC_API_IOS_BASE_URL ?? apiBaseUrl;
}

export const ENV = {
  API_BASE_URL: apiBaseUrl,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
  IMAGE_BASE_URL: process.env.EXPO_PUBLIC_IMAGE_BASE_URL!,
  MERCHANT_NAME: process.env.EXPO_PUBLIC_MERCHANT_NAME!,
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  URL_SCHEME: process.env.EXPO_PUBLIC_URL_SCHEME!,
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
};
