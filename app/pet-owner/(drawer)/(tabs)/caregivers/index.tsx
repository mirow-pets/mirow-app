import { StyleSheet, View } from "react-native";

import { router } from "expo-router";

import { whiteColor } from "@/constants/theme";
import { CaregiversList } from "@/features/caregivers/components/CaregiversList";
import { TCaregiver } from "@/types";

export default function CaregiversScreen() {
  const handleClick = (userId: TCaregiver["usersId"]) => {
    router.push(`/pet-owner/caregivers/${userId}`);
  };

  return (
    <View style={styles.container}>
      <CaregiversList onClick={handleClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: whiteColor,
  },
});
