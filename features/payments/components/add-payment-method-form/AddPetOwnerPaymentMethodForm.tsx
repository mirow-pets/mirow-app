import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { CardField } from "@stripe/stripe-react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { blackColor } from "@/constants/theme";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment/use-pet-owner-payment";
import { useAuth } from "@/hooks/use-auth";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";

import type { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput";

export interface AddPaymentMethodFormProps {
  onSuccess: () => void;
  onError: (_errorMessage: string) => void;
}

export const AddPetOwnerPaymentMethodForm = ({
  onSuccess,
  onError,
}: AddPaymentMethodFormProps) => {
  const { add, isAddingPaymentMethod } = usePetOwnerPayment();
  const [cardDetails, setCardDetails] = useState<Details>();
  const { refetch } = useRefetchQueries();
  const { currUser } = useAuth();

  const handleAdd = () => {
    if (!cardDetails?.complete) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter complete card details",
      });
      return;
    }
    add(undefined, {
      onSuccess: async () => {
        refetch([
          ["payment-methods", currUser?.sessionId],
          ["pet-owner-profile"],
          ["pet-owner-completion"],
        ]);

        Toast.show({
          type: "success",
          text1: "A new bank is added successfully",
        });

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

      <CardField
        cardStyle={{
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
          placeholderColor: "#8A8A8A",
          borderColor: "#E0E0E0",
          borderWidth: 1,
          borderRadius: 8,
          fontSize: 16,
          cursorColor: "#000000",
        }}
        style={styles.cardField}
        onCardChange={setCardDetails}
      />
      <Button
        onPress={handleAdd}
        disabled={!cardDetails?.complete || isAddingPaymentMethod}
      >
        Add card
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 20,
    color: blackColor,
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
});
