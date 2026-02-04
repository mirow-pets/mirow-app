import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loader";
import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { usePetOwnerPayBooking } from "@/hooks/pet-owner/use-pet-owner-pay-booking/use-pet-owner-pay-booking";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment/use-pet-owner-payment";
import { useRefetchQueries } from "@/hooks/use-refetch-queries";
import { TBooking, TPaymentMethod } from "@/types";

export interface PayBookingButtonProps {
  bookingId: TBooking["id"];
  onSuccess: () => void;
}

const CARD_MODAL_ID = "pay-booking-select-card";

export const PayBookingButton = ({
  bookingId,
  onSuccess,
}: PayBookingButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TPaymentMethod | null>(null);
  const { payBooking, isPayingBooking } = usePetOwnerPayBooking();
  const { paymentMethods, isLoadingPaymentMethods } = usePetOwnerPayment();
  const { refetch } = useRefetchQueries();

  useEffect(() => {
    if (!modalOpen) setSelectedCard(null);
  }, [modalOpen]);

  const handleConfirm = () => {
    if (!selectedCard) return;
    payBooking(
      { bookingId, paymentMethodId: selectedCard.id },
      {
        onSuccess: () => {
          refetch([["booking", bookingId]]);
          setModalOpen(false);
          onSuccess();
        },
      }
    );
  };

  const handleAddCard = () => {
    setModalOpen(false);
    router.push("/pet-owner/account/payment-methods/add");
  };

  const cards = paymentMethods?.data ?? [];

  return (
    <>
      <Button
        onPress={() => setModalOpen(true)}
        size="sm"
        disabled={isPayingBooking}
      >
        Pay Now
      </Button>
      <Modal
        id={CARD_MODAL_ID}
        title="Select a card"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        confirmText="Confirm"
        loading={isPayingBooking}
        disabled={!selectedCard || isPayingBooking}
        style={styles.modalContent}
      >
        {isLoadingPaymentMethods ? (
          <Loader />
        ) : (
          <View style={styles.body}>
            {cards.length === 0 ? (
              <ThemedText style={styles.emptyText}>
                No saved cards. Add a payment method below.
              </ThemedText>
            ) : (
              <View style={styles.cardList}>
                {cards.map((pm) => (
                  <TouchableOpacity
                    key={pm.id}
                    style={[
                      styles.cardItem,
                      selectedCard?.id === pm.id && styles.cardItemSelected,
                    ]}
                    onPress={() => setSelectedCard(pm)}
                    disabled={isPayingBooking}
                  >
                    <ThemedText type="defaultSemiBold">
                      {pm.card.display_brand}
                    </ThemedText>
                    <ThemedText style={styles.last4}>
                      **** **** **** {pm.card.last4}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.addCardRow}>
              <Button onPress={handleAddCard}>Add new card</Button>
            </View>
          </View>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    minWidth: 320,
  },
  body: {
    gap: 16,
  },
  emptyText: {
    marginBottom: 8,
  },
  cardList: {
    gap: 12,
  },
  cardItem: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E0E0E0",
  },
  cardItemSelected: {
    borderColor: "#000",
    borderWidth: 2,
  },
  last4: {
    fontSize: 12,
    marginTop: 4,
  },
  addCardRow: {
    paddingTop: 8,
  },
});
