import { StyleSheet, View } from "react-native";

import { Image, ImageBackground } from "expo-image";
import { ActivityIndicator } from "react-native-paper";

import { whiteColor } from "@/constants/theme";

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/splash-bg.png")}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        contentFit="cover"
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            width: 250,
            height: 100,
            marginBottom: 10,
            marginTop: 40,
            resizeMode: "contain",
          }}
        />
        <ActivityIndicator size={32} color={whiteColor} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
