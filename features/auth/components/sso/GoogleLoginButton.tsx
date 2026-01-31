import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";

import { ENV } from "@/env";
import { useAuth } from "@/hooks/use-auth";
import { Post } from "@/services/http-service";
import { TCurrentUser, UserRole } from "@/types/users";
import { confirm, onError } from "@/utils";

export interface GoogleLoginButtonProps {
  redirect: Href;
}

export const GoogleLoginButton = ({ redirect }: GoogleLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userRole, setAuth } = useAuth();

  const path =
    userRole === UserRole.PetOwner
      ? "/users/google/login"
      : "/caregivers/google/login";

  const { mutate, isPending } = useMutation<
    TCurrentUser & { token: string; isActivate: boolean },
    Error,
    { isActivate?: boolean }
  >({
    mutationFn: (input) => Post(path, input),
    onSuccess: async ({ token, isActivate, ...user }) => {
      if (isActivate) {
        confirm({
          title: "Reactivate your account",
          description:
            "Your account is currently deactivated. Would you like to reactivate it now?",
          onConfirm: () => mutate({ isActivate }),
        });
        return;
      }

      await setAuth({ token, currUser: user });

      router.replace(redirect);

      Toast.show({
        type: "success",
        text1: "Logged in successfully!",
      });
    },
    onError,
  });

  const processResponse = async ({
    idToken,
    isActivate,
  }: Partial<TCurrentUser> & {
    idToken: string;
    token?: string;
    isActivate?: boolean;
  }) => {
    const res = await Post(path, {
      idToken,
      isActivate,
      isGoogle: true,
    });

    console.log("res", res);
    if (res.isActivate) {
      confirm({
        title: "Reactivate your account",
        description:
          "Your account is currently deactivated. Would you like to reactivate it now?",
        onConfirm: () => processResponse({ idToken, isActivate: true }),
      });

      return;
    }

    if (!res.token || !res.sessionId) return;

    const { token, ...user } = res;

    await setAuth({ token, currUser: user as TCurrentUser });

    router.replace(redirect);

    Toast.show({
      type: "success",
      text1: "Logged in successfully!",
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      await GoogleSignin?.signOut();
      await GoogleSignin.hasPlayServices();
      const signInData = await GoogleSignin.signIn();

      const userInfo = signInData.data;

      if (!userInfo) {
        setIsLoading(false);
        return;
      }

      const idToken = userInfo?.idToken;
      console.log("Google User info:", userInfo);

      if (idToken) {
        await processResponse({ idToken });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: (error as Error).message,
      });
      console.error("GoogleSignin Error:", error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
      iosClientId: ENV.GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const loading = isLoading || isPending;

  return (
    <TouchableOpacity
      onPress={handleLogin}
      style={{
        borderRadius: 16,
        backgroundColor: "white",
        padding: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        opacity: loading ? 0.6 : 1,
      }}
      activeOpacity={0.7}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Image
          source={require("@/assets/images/google-logo.png")}
          style={{ width: 32, height: 32, borderRadius: 8 }}
        />
      )}
    </TouchableOpacity>
  );
};
