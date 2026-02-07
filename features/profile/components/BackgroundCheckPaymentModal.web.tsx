import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { CardElement } from "@stripe/react-stripe-js";
import Toast from "react-native-toast-message";

import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";

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

const PAYMENT_MODAL_ID = "background-check-payment";

export interface BackgroundCheckPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPay: () => void;
  loading?: boolean;
}

export function BackgroundCheckPaymentModal({
  open,
  onClose,
  onPay,
  loading = false,
}: BackgroundCheckPaymentModalProps) {
  const [cardComplete, setCardComplete] = useState(false);

  const handleConfirm = () => {
    if (!cardComplete) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter complete card details",
      });
      return;
    }
    onPay();
  };

  return (
    <Modal
      id={PAYMENT_MODAL_ID}
      title="Pay for background check"
      open={open}
      onCancel={onClose}
      onConfirm={handleConfirm}
      confirmText="Pay"
      cancelText="Cancel"
      loading={loading}
      disabled={!cardComplete || loading}
      style={styles.modalContent}
    >
      <View style={styles.body}>
        <ThemedText style={styles.label}>Card details</ThemedText>
        <View style={styles.cardElementWrapper}>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    minWidth: 320,
  },
  body: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
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
});
