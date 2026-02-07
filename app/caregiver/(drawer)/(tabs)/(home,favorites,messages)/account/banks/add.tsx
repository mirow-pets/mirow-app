import { useState } from "react";
import { View } from "react-native";

import { router } from "expo-router";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { whiteColor } from "@/constants/theme";
import { AddCaregiverPaymentMethodForm } from "@/features/payments/components/add-payment-method-form/AddCaregiverPaymentMethodForm";
import { AddPaymentMethodResult } from "@/features/payments/components/add-payment-method-form/AddPaymentMethodResult";

type ScreenState = "form" | "success" | "error";

export default function AddBankScreen() {
  const [screenState, setScreenState] = useState<ScreenState>("form");
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <View style={{ flex: 1, backgroundColor: whiteColor }}>
      {screenState === "form" && (
        <>
          <ScreenHeader title="Add Bank" />

          <AddCaregiverPaymentMethodForm
            onSuccess={() => setScreenState("success")}
            onError={(errorMessage) => {
              setScreenState("error");
              setErrorMessage(errorMessage);
            }}
          />
        </>
      )}

      {screenState !== "form" && (
        <AddPaymentMethodResult
          screenState={screenState}
          handleDone={router.back}
          handleTryAgain={() => setScreenState("form")}
          errorMessage={errorMessage}
        />
      )}
    </View>
  );
}
