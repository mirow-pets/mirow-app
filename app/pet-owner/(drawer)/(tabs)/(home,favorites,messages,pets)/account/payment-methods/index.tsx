import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

import { Loader } from "@/components/loader";
import { Menu } from "@/components/menu/Menu";
import { ThemedText } from "@/components/themed-text";
import { whiteColor } from "@/constants/theme";
import { usePetOwnerPayment } from "@/hooks/pet-owner/use-pet-owner-payment/use-pet-owner-payment";
import { TPaymentMethod } from "@/types";
import { confirm } from "@/utils";

const Item = ({
  paymentMethod,
  hasDelete,
}: {
  paymentMethod: TPaymentMethod;
  hasDelete: boolean;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { deleteBankAccount } = usePetOwnerPayment();

  return (
    <View style={styles.itemContainer}>
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText type="defaultSemiBold">
            {paymentMethod.card.display_brand}
          </ThemedText>
        </View>
        <ThemedText style={{ fontSize: 12 }}>
          Acc no: ********{paymentMethod.card.last4}
        </ThemedText>
      </View>
      {hasDelete && (
        <Menu
          isVisible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setShowMenu(true)}
              style={{ width: 16 }}
            >
              <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          }
          options={[
            {
              label: "Delete",
              onPress: () =>
                confirm({
                  title: "Delete paymentMethod",
                  description: `Are you sure that you want to delete this ${paymentMethod?.card?.display_brand} (********${paymentMethod?.card?.last4})`,
                  confirmText: "Delete",
                  onConfirm: () => deleteBankAccount(paymentMethod.id),
                }),
            },
          ]}
          position="bottom-right"
        />
      )}
    </View>
  );
};

export default function PaymentMethodsScreen() {
  const { paymentMethods, isLoadingPaymentMethods } = usePetOwnerPayment();

  if (isLoadingPaymentMethods) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: whiteColor }}>
      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Button
            onPress={() =>
              router.push("/pet-owner/account/payment-methods/add")
            }
          >
            Add Payment Method
          </Button>
          {!paymentMethods?.data?.length && (
            <ThemedText>No payment method account</ThemedText>
          )}
          <FlatList
            scrollEnabled={false}
            data={paymentMethods?.data ?? []}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item, index }) => (
              <Item
                paymentMethod={item}
                key={index}
                hasDelete={(paymentMethods?.data?.length ?? 0) > 1}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
    backgroundColor: whiteColor,
    flex: 1,
  },
  itemContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});
