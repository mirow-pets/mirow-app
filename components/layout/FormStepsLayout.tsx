import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

import { NextButton } from "@/components/button/NextButton";
import { PrevButton } from "@/components/button/PrevButton";

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
  return (
    <>
      {children}
      <View style={{ flexDirection: "row", gap: 16, justifyContent: "center" }}>
        {loading ? (
          <ActivityIndicator size={24} />
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
