import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { PasswordInput } from "@/components/form/PasswordInput";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { TLogin, loginSchema } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Post } from "@/services/http-service";
import { TCurrentUser, UserRole } from "@/types/users";
import { confirm, onError } from "@/utils";

export interface LoginFormProps {
  path: string;
  redirect: Href;
}

export const LoginForm = ({ path, redirect }: LoginFormProps) => {
  const primaryColor = useThemeColor({}, "primary");
  const secondaryColor = useThemeColor({}, "secondary");
  const router = useRouter();
  const { setAuth, userRole } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation<
    TCurrentUser & { token: string; isActivate: boolean },
    Error,
    TLogin
  >({
    mutationFn: (input: TLogin) => Post(path, input),
    onSuccess: async ({ token, isActivate, ...user }) => {
      if (isActivate) {
        confirm({
          title: "Reactivate your account",
          description:
            "Your account is currently deactivated. Would you like to reactivate it now?",
          onConfirm: () => mutate({ ...form.getValues(), isActivate }),
        });
        return;
      }
      if (!userRole) return;

      await setAuth({ token, currUser: user });

      router.replace(redirect);

      Toast.show({
        type: "success",
        text1: "Logged in successfully!",
      });
    },
    onError,
  });

  const submit = (input: TLogin) => {
    mutate(input);
  };

  const handleForgotPassword = () => {
    router.push(`/${userRole as UserRole}/forgot-password`);
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <Input name="username" placeholder="Username" autoCapitalize="none" />
        <PasswordInput name="password" placeholder="Password" />
        <View style={styles.forgotPasswordWrapper}>
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordTouchable}
          >
            <ThemedText
              style={[styles.forgotPasswordText, { color: secondaryColor }]}
            >
              Forgot password?
            </ThemedText>
          </TouchableOpacity>
        </View>
        <Button
          title="Login"
          onPress={form.handleSubmit(submit)}
          loading={isPending}
          color="secondary"
          style={{ minWidth: "70%", marginTop: 18 }}
        />
        <View style={{ alignItems: "center", marginTop: 32, gap: 4 }}>
          <ThemedText style={{ fontWeight: "600", fontSize: 15 }}>
            Having trouble?
          </ThemedText>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}
          >
            <ThemedText style={{ fontSize: 14 }}>Contact Support:</ThemedText>
            <TouchableOpacity
              onPress={() => {
                // Use Linking to open the email app with a pre-filled email address
                import("react-native").then(({ Linking }) => {
                  Linking.openURL("mailto:info@mirow.app");
                });
              }}
            >
              <ThemedText
                style={{
                  color: whiteColor,
                  textDecorationLine: "underline",
                  fontSize: 15,
                  fontWeight: "500",
                  marginTop: 2,
                  letterSpacing: 0.2,
                }}
                selectable
              >
                info@mirow.app
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 32,
  },
  forgotPasswordWrapper: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 18,
    marginRight: 4,
  },
  forgotPasswordTouchable: {
    // Add touchable area expansion if desired
  },
  forgotPasswordText: {
    textDecorationLine: "underline",
    fontSize: 15,
    fontWeight: "500",
  },
});
