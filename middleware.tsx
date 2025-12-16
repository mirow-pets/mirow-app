import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

import { UserRole } from "./types";

export async function middleware(request: { pathname: string }) {
  const currUserString = await AsyncStorage.getItem("currUser");
  const userRole = await AsyncStorage.getItem("userRole");
  const { pathname } = request;

  if (pathname.startsWith("/index") === false) {
    if (userRole && currUserString) {
      return <Redirect href={`/${userRole as UserRole}/(drawer)/(tabs)`} />;
    }

    if (userRole) {
      return <Redirect href={`/${userRole as UserRole}`} />;
    }
  }

  return null;
}
