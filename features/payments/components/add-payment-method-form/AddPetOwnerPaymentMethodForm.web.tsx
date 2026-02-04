import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { CardElement, useStripe } from "@stripe/react-stripe-js";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { lightGrayColor, primaryColor, whiteColor } from "@/constants/theme";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment/use-pet-owner-payment";
import { useAuth } from "@/hooks/use-auth";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";

const BORDER_GRAY = "#E0E0E0";

// Match react-native-paper outlined TextInput (MD3)
const OUTLINE_COLOR = "rgba(24, 14, 14, 0.38)";
const OUTLINE_BORDER_RADIUS = 4;
const INPUT_PADDING_H = 16;
const INPUT_PADDING_V = 14;
const INPUT_MIN_HEIGHT = 56;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#000000",
      fontSize: "16px",
      fontFamily: "Poppins, Arial, sans-serif",
      "::placeholder": {
        color: "rgba(0, 0, 0, 0.38)",
      },
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "0",
      padding: "0",
    },
    invalid: {
      color: "#B3261E",
    },
  },
};

export interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onError: (_errorMessage: string) => void;
}

export const AddPetOwnerPaymentMethodForm = ({
  onSuccess,
  onError,
}: AddPaymentMethodFormProps) => {
  const stripe = useStripe();
  const { add, isAddingPaymentMethod } = usePetOwnerPayment();
  const [cardComplete, setCardComplete] = useState(false);
  const { refetch } = useRefetchQueries();
  const { currUser } = useAuth();

  const handleAdd = () => {
    if (!cardComplete) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter complete card details",
      });
      return;
    }
    if (!stripe) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Stripe has not loaded yet. Please try again.",
      });
      return;
    }
    add(undefined, {
      onSuccess: async () => {
        await refetch([
          ["payment-methods", currUser?.sessionId],
          ["pet-owner-profile"],
          ["pet-owner-completion"],
        ]);
        onSuccess();
      },
      onError: (error) => {
        onError(error.message);
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Card preview */}
      <Image
        source={require("@/assets/images/card.png")}
        style={styles.cardPreview}
      />

      {/* Form */}
      <View style={styles.formSection}>
        <ThemedText style={styles.label}>Card Number</ThemedText>
        <View style={styles.cardElementWrapper}>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </View>
      </View>

      <Button
        onPress={handleAdd}
        disabled={!cardComplete || isAddingPaymentMethod}
      >
        {isAddingPaymentMethod ? "Adding…" : "Add Card"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: whiteColor,
  },
  cardPreview: {
    width: "100%",
    aspectRatio: 1.586,
    maxHeight: 800,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  cardPreviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chip: {
    width: 36,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#D4AF37",
  },
  cardBank: {
    color: whiteColor,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  cardWifi: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  cardNumber: {
    color: whiteColor,
    fontSize: 16,
    letterSpacing: 2,
  },
  cardLogo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: -8,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D4AF37",
    opacity: 0.9,
  },
  logoCircleRight: {
    marginRight: -6,
  },
  formSection: {
    backgroundColor: lightGrayColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  input: {
    backgroundColor: whiteColor,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000000",
  },
  cardElementWrapper: {
    backgroundColor: "transparent",
    borderRadius: OUTLINE_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: OUTLINE_COLOR,
    minHeight: INPUT_MIN_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: INPUT_PADDING_H,
    paddingVertical: INPUT_PADDING_V,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: whiteColor,
    fontSize: 16,
    fontWeight: "600",
  },
});
