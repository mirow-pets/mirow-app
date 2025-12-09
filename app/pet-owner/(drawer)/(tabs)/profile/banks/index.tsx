import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loader";
import { Menu } from "@/components/menu/Menu";
import { ThemedText } from "@/components/themed-text";
import { usePayment } from "@/hooks/use-payment";
import { useThemeColor } from "@/hooks/use-theme-color";
import { TBankAccount } from "@/types";
import { confirm } from "@/utils";

const Item = ({ bank }: { bank: TBankAccount }) => {
  const primaryColor = useThemeColor({}, "primary");
  const [showMenu, setShowMenu] = useState(false);
  const { setAsDefault, deleteBankAccount } = usePayment();

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
          <ThemedText type="defaultSemiBold">{bank.bank_name}</ThemedText>
          {bank.default_for_currency && (
            <ThemedText style={{ color: primaryColor, fontSize: 12 }}>
              Default
            </ThemedText>
          )}
        </View>
        <ThemedText style={{ fontSize: 12 }}>
          Acc Holder: {bank.account_holder_name}
        </ThemedText>
        <ThemedText style={{ fontSize: 12 }}>
          Acc no: ********{bank.last4}
        </ThemedText>
      </View>
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
          ...(!bank.default_for_currency
            ? [
                {
                  label: "Set as default",
                  onPress: () => setAsDefault(bank.id),
                },
              ]
            : []),
          {
            label: "Delete",
            onPress: () =>
              confirm({
                title: "Delete bank",
                description: `Are you sure that you want to delete this ${bank?.bank_name} (********${bank?.last4})`,
                confirmText: "Delete",
                onConfirm: () => deleteBankAccount(bank.id),
              }),
          },
        ]}
        position="bottom-right"
      />
    </View>
  );
};

export default function BanksScreen() {
  const { bankAccounts, isLoadingBankAccounts } = usePayment();

  if (isLoadingBankAccounts) return <Loader />;

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Button
          title="Add Bank"
          size="sm"
          onPress={() => router.push("/caregiver/profile/banks/add")}
        />
        <FlatList
          scrollEnabled={false}
          data={bankAccounts?.data ?? []}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item, index }) => <Item bank={item} key={index} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 8,
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
