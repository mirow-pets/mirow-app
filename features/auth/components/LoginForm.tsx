import React from "react";
import { StyleSheet, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { Input } from "@/components/form/Input";
import { PasswordInput } from "@/components/form/PasswordInput";
import { TLogin, loginSchema } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { Post } from "@/services/http-service";
import { TCurrentUser } from "@/types/users";

export interface LoginFormProps {
  path: string;
  redirect: Href;
}

export const LoginForm = ({ path, redirect }: LoginFormProps) => {
  const router = useRouter();
  const { setCurrUser, userRole } = useAuth();

  const { mutate, isPending } = useMutation<
    TCurrentUser & { token: string },
    Error,
    TLogin
  >({
    mutationFn: (input: TLogin) => Post(path, input),
    onSuccess: async ({ token, ...user }) => {
      if (!userRole) return;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("currUser", JSON.stringify(user));
      await AsyncStorage.setItem("userRole", userRole);

      setCurrUser(user);

      router.replace(redirect);
      Toast.show({
        type: "success",
        text1: "Logged in successfully!",
      });
    },
    onError: (err) => {
      let message = "An unexpected error occurred. Please try again.";

      if ("statusCode" in err) {
        if (err.statusCode === 401) message = "Invalid username or password";
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const submit = (input: TLogin) => {
    mutate(input);
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <Input name="username" placeholder="Username" autoCapitalize="none" />
        <PasswordInput name="password" placeholder="Password" />
        <Button
          title="Login"
          onPress={form.handleSubmit(submit)}
          loading={isPending}
          color="secondary"
          style={{ minWidth: "70%" }}
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
});
