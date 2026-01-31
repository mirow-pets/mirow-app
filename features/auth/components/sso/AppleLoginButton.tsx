import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

import { useMutation } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import { Href, router } from "expo-router";
import Toast from "react-native-toast-message";

import { useAuth } from "@/hooks/use-auth";
import { Post } from "@/services/http-service";
import { TCurrentUser, UserRole } from "@/types/users";
import { confirm, onError } from "@/utils";

/**
 * NOTE:
 * AppleAuthentication.AppleAuthenticationButton will throw an error about not having an implemented <ViewManagerAdapter>
 * on Android devices. The Apple login button should only render on iOS and on supported devices.
 */
export interface AppleLoginButtonProps {
  redirect: Href;
}

export const AppleLoginButton = ({ redirect }: AppleLoginButtonProps) => {
  const { userRole, setAuth } = useAuth();

  const path =
    userRole === UserRole.PetOwner
      ? "/users/google/login"
      : "/caregivers/google/login";

  // Only render Apple Login button on iOS and Expo supported devices
  // Fallback to a disabled or info view otherwise

  // This useEffect ensures button only renders if supported, otherwise fallback
  const [available, setAvailable] = useState<boolean | null>(null);

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
      isGoogle: false,
    });

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
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential?.identityToken) {
        await processResponse({ idToken: JSON.stringify(credential) });
      }

      // signed in: implement sign in logic here
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // user canceled flow
      } else {
        // handle other errors
        Toast.show({
          type: "error",
          text1: e.message,
        });
      }
    }
  };

  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAvailable)
      .catch(() => setAvailable(false));
  }, []);

  if (!AppleAuthentication.isAvailableAsync) {
    return null;
  }

  if (!available) {
    return null; // still checking
  }

  const loading = isPending;

  return (
    <TouchableOpacity
      style={{
        borderRadius: 16,
        backgroundColor: "white",
        // padding: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        opacity: loading ? 0.6 : 1,
      }}
      activeOpacity={0.7}
      onPress={handleLogin}
    >
      <Text style={{ fontSize: 32 }}></Text>
    </TouchableOpacity>
  );
};
