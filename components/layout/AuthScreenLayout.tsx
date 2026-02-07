import { ReactNode, useEffect } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";

import { Image, ImageBackground, ImageSource } from "expo-image";
import { Href, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";

export interface AuthScreenLayoutProps {
  children: ReactNode;
  bgImage?: ImageSource;
  showLogo?: boolean;
}

export default function AuthScreenLayout({
  children,
  bgImage,
  showLogo,
}: AuthScreenLayoutProps) {
  const router = useRouter();
  const { currUser, userRole } = useAuth();

  useEffect(() => {
    if (currUser) router.push(`/${userRole}/(drawer)/(tabs)` as Href);
  }, [currUser, userRole, router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: whiteColor }}
      behavior="height"
    >
      <ImageBackground
        source={bgImage || require("@/assets/images/signup-bg.png")}
        style={{ flex: 1 }}
        contentFit="fill"
      >
        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {showLogo && (
              <Image
                source={require("@/assets/images/logo.png")}
                style={{
                  width: 250,
                  height: 140,
                  marginBottom: 10,
                  marginTop: 40,
                  resizeMode: "contain",
                }}
              />
            )}
            <View style={{ width: "100%" }}>{children}</View>
          </View>
        </ScrollView>
      </ImageBackground>
      {/* </ScrollView > */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    color: whiteColor,
  },
  subTitle: {
    textAlign: "center",
    color: whiteColor,
  },
});
