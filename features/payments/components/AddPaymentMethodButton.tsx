import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { CardField } from "@stripe/stripe-react-native";
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput";
import Toast from "react-native-toast-message";

import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { blackColor } from "@/constants/theme";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment";
import { useThemeColor } from "@/hooks/use-theme-color";

export const AddPaymentMethodButton = () => {
  const primaryColor = useThemeColor({}, "primary");
  const { add, isAddingPaymentMethod } = usePetOwnerPayment();
  const [cardDetails, setCardDetails] = useState<Details>();

  const handleConfirm = () => {
    if (!cardDetails?.complete) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter complete card details",
      });

      return;
    }

    add();
  };

  return (
    <Modal
      title="Add Card"
      id="add-card"
      trigger={
        <View
          style={{
            borderRadius: 56,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 3,
            backgroundColor: primaryColor,
            minWidth: 110,
            paddingVertical: 6,
            paddingHorizontal: 8,
          }}
        >
          <ThemedText
            style={{
              fontFamily: "Poppins-Bold",
              fontWeight: 600,
              lineHeight: 32,
              textAlign: "center",
            }}
          >
            Add
          </ThemedText>
        </View>
      }
      loading={isAddingPaymentMethod}
      onConfirm={handleConfirm}
    >
      <CardField
        cardStyle={{
          backgroundColor: "#FFFFFF", // explicit white
          textColor: "#000000", // explicit black for card text
          placeholderColor: "#8A8A8A", // explicit grey for placeholder
          borderColor: "#E0E0E0",
          borderWidth: 1,
          borderRadius: 8,
          fontSize: 16,
          cursorColor: "#000000",
        }}
        style={styles.cardField}
        onCardChange={setCardDetails}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 20,
    color: blackColor,
  },
});
