import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Href, router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";

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

  // To get an id_token in the response, you must use the Google OAuth "id_token" by specifying the proper "scope" and "response_type"
  // We use 'flow: "auth-code"' with "id_token" response, and parse id_token from the response

  const handleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",
    onSuccess: async (response) => {
      // "response" should contain a "code"
      setIsLoading(true);
      try {
        if (!response || !response.code) {
          setIsLoading(false);
          return;
        }

        // Exchange authorization code for id_token on the backend
        // Your backend should accept the code and obtain the id_token from Google
        await processResponse({ code: response.code });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: (error as Error).message,
        });
        console.error("GoogleSignin Error:", error);
      }
      setIsLoading(false);
    },
  });

  const path = "/v2/auth/sso";

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
    code,
    idToken,
    isActivate,
  }: Partial<TCurrentUser> & {
    idToken?: string;
    token?: string;
    isActivate?: boolean;
    code?: string;
  }) => {
    const res = await Post(path, {
      code,
      idToken,
      isActivate,
      socialMedia: "google",
      role: userRole === UserRole.PetOwner ? "petowner" : "caregiver",
    });

    if (res.isActivate) {
      confirm({
        title: "Reactivate your account",
        description:
          "Your account is currently deactivated. Would you like to reactivate it now?",
        onConfirm: () => processResponse({ idToken, code, isActivate: true }),
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
