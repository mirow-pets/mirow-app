import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Button, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

import { PasswordInput } from "@/components/form/PasswordInput";
import { TextInputField } from "@/components/form/TextInputField";
import { ThemedText } from "@/components/themed-text";
import { blackColor, grayColor } from "@/constants/theme";
import { TLogin, loginSchema } from "@/features/auth/validations";
import { useAuth } from "@/hooks/use-auth";
import { Post } from "@/services/http-service";
import { TCurrentUser, UserRole } from "@/types/users";
import { confirm, onError } from "@/utils";

import { AppleLoginButton } from "./sso/AppleLoginButton";
import { GoogleLoginButton } from "./sso/GoogleLoginButton";

export interface LoginFormProps {
  path: string;
  redirect: Href;
  signUpPath: Href;
}

export const LoginForm = ({ path, redirect, signUpPath }: LoginFormProps) => {
  const theme = useTheme();
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

  const handleSignUp = () => {
    router.push(signUpPath);
  };

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <TextInputField
          name="username"
          label="Username"
          placeholder="Username"
          style={{ width: "100%" }}
          mode="outlined"
          autoCapitalize="none"
        />

        <PasswordInput
          name="password"
          label="Password"
          placeholder="Password"
          style={{ width: "100%" }}
          mode="outlined"
        />

        <View style={styles.forgotPasswordWrapper}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>
              Forgot password?
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Button
          onPress={form.handleSubmit(submit)}
          loading={isPending}
          mode="contained"
          buttonColor={theme.colors.secondary}
          textColor={blackColor}
          style={{
            width: "90%",
            borderRadius: 28,
            marginTop: 56,
            marginBottom: 24,
          }}
          labelStyle={{
            fontSize: 20,
            height: 28,
            alignItems: "center",
            textAlignVertical: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: 28,
            fontWeight: "bold",
          }}
        >
          Log in
        </Button>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              height: 1,
              borderWidth: 0.5,
              borderColor: grayColor,
              flex: 1,
            }}
          />
          <ThemedText>Or Sign up with</ThemedText>
          <View
            style={{
              height: 1,
              borderWidth: 0.5,
              borderColor: grayColor,
              flex: 1,
            }}
          />
        </View>

        <View
          style={{
            alignItems: "center",
            marginVertical: 16,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <AppleLoginButton redirect={redirect} />
          <GoogleLoginButton redirect={redirect} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
            gap: 4,
          }}
        >
          <ThemedText style={{ fontWeight: "600", fontSize: 15 }}>
            Don&apos;t have an account yet?
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 15,
              fontWeight: "bold",
              marginTop: -3,
            }}
            selectable
            onPress={handleSignUp}
          >
            Sign up
          </ThemedText>
        </View>

        <View style={{ alignItems: "center", marginTop: 32, gap: 4 }}>
          <ThemedText style={{ fontWeight: "600", fontSize: 15 }}>
            Having trouble?
          </ThemedText>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}
          >
            <ThemedText style={{ fontSize: 14 }}>Contact Support:</ThemedText>

            <ThemedText
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 3,
              }}
              selectable
              onPress={() => {
                // Use Linking to open the email app with a pre-filled email address
                import("react-native").then(({ Linking }) => {
                  Linking.openURL("mailto:info@mirow.app");
                });
              }}
            >
              info@mirow.app
            </ThemedText>
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
    flex: 1,
  },
  forgotPasswordWrapper: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 18,
    marginRight: 4,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
