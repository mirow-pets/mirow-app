import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import { TCurrentUser, UserRole } from "@/types/users";

export interface SetAuthArgs {
  token: string;
  currUser: TCurrentUser;
}

export interface AuthState {
  userRole?: UserRole;
  token?: string;
  currUser?: TCurrentUser;
  fcmToken?: string;
  setUserRole: (_userRole: UserRole) => Promise<void>;
  removeUserRole: () => Promise<void>;
  setAuth: (_input: SetAuthArgs) => Promise<void>;
  removeAuth: () => Promise<void>;
  setFcmToken: (_token: string) => Promise<void>;
  removeFcmToken: () => Promise<void>;
}

export const authStore = create<AuthState>((set) => ({
  userRole: undefined,
  token: undefined,
  currUser: undefined,
  fcmToken: undefined,

  setUserRole: async (userRole: UserRole) => {
    await AsyncStorage.setItem("userRole", userRole);
    set({ userRole });
  },

  removeUserRole: async () => {
    await AsyncStorage.removeItem("userRole");
    set({ userRole: undefined });
  },

  setAuth: async (input: SetAuthArgs) => {
    await AsyncStorage.setItem("accessToken", input.token);
    await AsyncStorage.setItem("currUser", JSON.stringify(input.currUser));
    set(input);
  },

  removeAuth: async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("currUser");
    await AsyncStorage.removeItem("is2FAuthVerified");

    set({
      token: undefined,
      currUser: undefined,
    });
  },

  setFcmToken: async (fcmToken: string) => {
    await AsyncStorage.setItem("fcmToken", fcmToken);
    set({ fcmToken });
  },

  removeFcmToken: async () => {
    await AsyncStorage.removeItem("fcmToken");
    set({ fcmToken: undefined });
  },
}));
