import { ReactNode } from "react";
import { Animated, Easing, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { NextButton } from "@/components/button/NextButton";
import { PrevButton } from "@/components/button/PrevButton";
import { whiteColor } from "@/constants/theme";

export interface FormStepsLayoutProps {
  children: ReactNode;
  loading?: boolean;
  onPrev?: () => void;
  onNext: () => void;
}

export const FormStepsLayout = ({
  children,
  loading,
  onNext,
  onPrev,
}: FormStepsLayoutProps) => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      {children}
      <View style={{ flexDirection: "row", gap: 16, justifyContent: "center" }}>
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons
              name="loading"
              size={56}
              color={whiteColor}
            />
          </Animated.View>
        ) : (
          <>
            {onPrev && <PrevButton onPress={onPrev} loading={loading} />}
            <NextButton onPress={onNext} loading={loading} />
          </>
        )}
      </View>
    </>
  );
};
