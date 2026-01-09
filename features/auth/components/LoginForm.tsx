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
