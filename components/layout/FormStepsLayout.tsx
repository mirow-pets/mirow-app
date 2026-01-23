import { ReactNode, useLayoutEffect } from "react";
import { View } from "react-native";

import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "expo-router";
import { ProgressBar, useTheme } from "react-native-paper";

import { Button } from "@/components/button/Button";
import { primaryColor, whiteColor } from "@/constants/theme";

export interface FormStepsLayoutProps {
  children: ReactNode;
  loading?: boolean;
  onPrev?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  progress?: number;
}

export const FormStepsLayout = ({
  children,
  loading,
  onNext,
  onPrev,
  nextDisabled,
  progress = 0,
}: FormStepsLayoutProps) => {
  const theme = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={onPrev} />,
      headerTitle: () => (
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={{ height: 8, borderRadius: 8 }}
        />
      ),
      headerRight: () => <View style={{ width: 50 }}></View>,
    });
  }, [navigation, onPrev, progress, theme.colors.primary]);

  return (
    <>
      {children}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Button
          onPress={onNext}
          loading={loading}
          disabled={nextDisabled}
          buttonColor={primaryColor}
          textColor={whiteColor}
          style={{ width: "80%", marginTop: 56 }}
        >
          Continue
        </Button>
      </View>
    </>
  );
};
