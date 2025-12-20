import { ReactNode, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ImageBackground, ImageSource } from "expo-image";
import { Href, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";

export interface AuthScreenLayoutProps {
  image: ImageSource;
  title: string;
  subTitle?: ReactNode;
  children: ReactNode;
  bgImage?: ImageSource;
  showSwitchRole?: boolean;
}

export default function AuthScreenLayout({
  image,
  title,
  subTitle,
  children,
  bgImage,
  showSwitchRole,
}: AuthScreenLayoutProps) {
  const router = useRouter();
  const { currUser, userRole, setUserRole } = useAuth();

  const handleSwitchRole = async () => {
    setUserRole(undefined);
    await AsyncStorage.removeItem("userRole");
    router.replace("/");
  };

  useEffect(() => {
    if (currUser) router.push(`/${userRole}/(drawer)/(tabs)` as Href);
  }, [currUser, userRole, router]);

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <ImageBackground
        source={bgImage || require("@/assets/images/pet-owner-login-bg.png")}
        style={{ flex: 1 }}
        contentFit="cover"
      >
        <View style={styles.container}>
          {showSwitchRole && (
            <TouchableOpacity
              onPress={handleSwitchRole}
              style={{ position: "absolute", top: 32 }}
            >
              <Text>Switch role</Text>
            </TouchableOpacity>
          )}
          <View style={styles.topSection}>
            <Image
              source={require("@/assets/images/mirow-text-logo.png")}
              style={{ width: 250, height: 80, objectFit: "fill" }}
            />
            <Image
              source={image}
              style={{ width: 250, height: 300, objectFit: "fill" }}
            />
          </View>
          <View style={styles.bottomSection}>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            <View style={{ marginVertical: 4 }} />
            {typeof subTitle === "string" ? (
              <ThemedText type="subtitle" style={styles.subTitle}>
                {subTitle}
              </ThemedText>
            ) : (
              subTitle
            )}
            {/* <View style={{ marginVertical: 2 }} /> */}
            <View style={{ width: "100%" }}>{children}</View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  topSection: {
    justifyContent: "flex-end",
    marginTop: 180,
    alignItems: "center",
    gap: 16,
  },
  bottomSection: {
    alignItems: "center",
    minHeight: "50%",
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
