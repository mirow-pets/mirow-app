import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { useCaregiver } from "@/hooks/use-caregiver";

export default function CaregiverScreen() {
  const { userId } = useLocalSearchParams();
  const { caregiver, isLoadingCaregiver, getCaregiver } = useCaregiver();
  const router = useRouter();

  useEffect(() => getCaregiver(userId as string), [userId, getCaregiver]);

  // const handleDelete = () => {
  //   confirm({
  //     title: "Delete caregiver",
  //     description: "Are you sure you want to delete the caregiver?",
  //     onConfirm: () => deleteCaregiver(caregiver.id),
  //   });
  // };

  if (isLoadingCaregiver) return <Text>Loading caregiver...</Text>;

  if (!caregiver) return <Text>Caregiver Not Found</Text>;

  return (
    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.banner}>
          <PetAvatar src={caregiver.users.profileImage} />
          <View style={{ flex: 1 }}>
            <ThemedText>{caregiver.users.firstName}</ThemedText>
          </View>
        </View>
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
  banner: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  infoCard: {
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: "5%",
  },
  vaccineText: {
    fontSize: 18,
    color: "#000000",
    alignSelf: "center",
  },
  ownerName: {
    fontSize: 18,
    color: "#020202",
  },
  notes: {
    backgroundColor: "#38b6ff30",
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    minHeight: 65,
  },
  lableText: {
    marginRight: 15,
    marginBottom: 15,
    color: "#404040",
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    color: "#020202",
    marginBottom: 15,
  },
  lableValue: {
    fontSize: 15,
    color: "#000000",
    marginBottom: 6,
  },
  dottedStyle: {
    borderWidth: 0.5,
    // borderStyle: 'dotted',
    width: 150,
    borderColor: "#a6a6a6",
    marginBottom: 5,
  },
});
