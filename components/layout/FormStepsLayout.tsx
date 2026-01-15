import { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

import { NextButton } from "@/components/button/NextButton";
import { PrevButton } from "@/components/button/PrevButton";

export interface FormStepsLayoutProps {
  children: ReactNode;
  loading?: boolean;
  onPrev?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
}

export const FormStepsLayout = ({
  children,
  loading,
  onNext,
  onPrev,
  nextDisabled,
  prevDisabled,
}: FormStepsLayoutProps) => {
  return (
    <>
      {children}
      <View style={{ flexDirection: "row", gap: 16, justifyContent: "center" }}>
        {loading ? (
          <ActivityIndicator size={24} />
        ) : (
          <>
            {onPrev && (
              <PrevButton
                onPress={onPrev}
                loading={loading}
                disabled={prevDisabled}
              />
            )}
            <NextButton
              onPress={onNext}
              loading={loading}
              disabled={nextDisabled}
            />
          </>
        )}
      </View>
    </>
  );
};
