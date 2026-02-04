import { StyleSheet, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";
import { grayColor, greenColor, redColor, whiteColor } from "@/constants/theme";
import { PetOwnerProfileDetailsCard } from "@/features/profile/components/PetOwnerProfileDetails";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  const { profileCompletion } = usePetOwnerProfile();

  const menu = [
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Fullname",
      isDone: true,
      onPress: () => router.push("/pet-owner/account/fullname"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Phone",
      isDone: true,
      onPress: () => router.push("/pet-owner/account/phone"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Address",
      isDone: true,
      onPress: () => router.push("/pet-owner/account/address"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Emergency Contact",
      isDone: profileCompletion?.eDetails,
      onPress: () => router.push("/pet-owner/account/emergency-contact"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Payment Information",
      isDone: profileCompletion?.isCardAdded,
      onPress: () => router.push("/pet-owner/account/payment-methods"),
    },
    {
      icon: (
        <MaterialIcons name="domain-verification" size={25} color={"#525252"} />
      ),
      label: "Pets",
      isDone: profileCompletion?.isPetsAdded,
      onPress: () => router.push("/pet-owner/pets"),
    },
  ];

  return (
    <View style={styles.container}>
      <PetOwnerProfileDetailsCard />
      <View style={{ height: 8, backgroundColor: grayColor, borderRadius: 4 }}>
        <View
          style={{
            height: 8,
            width: `${profileCompletion?.percentage}%`,
            backgroundColor: theme.colors.primary,
            borderRadius: 4,
          }}
        ></View>
      </View>
      <FlatList
        scrollEnabled={true}
        data={menu}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.itemContainer, item.isDone ? {} : styles.notDone]}
              onPress={item.onPress}
            >
              {item.isDone ? (
                <AntDesign name="check-circle" size={24} color={greenColor} />
              ) : (
                <AntDesign name="close-circle" size={24} color={redColor} />
              )}
              <ThemedText>{item.label}</ThemedText>
            </TouchableOpacity>
          );
        }}
      />
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
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  notDone: {
    borderColor: redColor,
  },
});
