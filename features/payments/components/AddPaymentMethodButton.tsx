import { useState } from "react";
import { StyleSheet } from "react-native";

import { CardField } from "@stripe/stripe-react-native";
import { Details } from "@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput";
import Toast from "react-native-toast-message";

import { Button } from "@/components/button/Button";
import { Modal } from "@/components/modal/Modal";
import { blackColor } from "@/constants/theme";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment";

export const AddPaymentMethodButton = () => {
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
      trigger={<Button>Add</Button>}
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
