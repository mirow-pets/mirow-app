import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { blackColor } from "@/constants/theme";
import { usePet } from "@/hooks/use-pet";
import { confirm, formatDateToMDY } from "@/utils";

export default function PetScreen() {
  const { petId } = useLocalSearchParams();
  const { pet, isLoadingPet, getPet, getPetType, deletePet, isDeletingPet } =
    usePet();
  const router = useRouter();

  useEffect(() => getPet(petId as string), [petId, getPet]);

  const handleDelete = () => {
    confirm({
      title: "Delete pet",
      description: "Are you sure you want to delete the pet?",
      onConfirm: () => deletePet(pet.id),
    });
  };

  if (isLoadingPet) return <ThemedText>Loading pet...</ThemedText>;

  if (!pet) return <ThemedText>Pet Not Found</ThemedText>;

  const handleEdit = () => {
    router.push(`/pet-owner/pets/${petId}/edit`);
  };

  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
        <View style={styles.banner}>
          <PetAvatar src={pet.profileImage} />
          <View style={{ flex: 1 }}>
            <ThemedText>{pet.name}</ThemedText>
            <ThemedText style={{ fontSize: 12 }}>
              {getPetType(pet.petTypesId)?.display}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={handleEdit}
            style={{ width: 50 }}
            disabled={isDeletingPet}
          >
            <ThemedText>Edit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={{ width: 50 }}
            disabled={isDeletingPet}
          >
            <ThemedText>Delete</ThemedText>
          </TouchableOpacity>
        </View>

        {pet?.careGiverNotes && (
          <>
            <ThemedText
              style={[styles.ownerName, { fontSize: 16, paddingLeft: 5 }]}
            >
              Special Instructions/Notes
            </ThemedText>
            <View style={styles.notes}>
              <ThemedText
                style={[styles.ownerName, { fontSize: 14, color: "#525252" }]}
              >
                {" "}
                {pet?.careGiverNotes}
              </ThemedText>
            </View>
          </>
        )}
        <View style={styles.infoCard}>
          <View>
            <ThemedText style={[styles.lableText]}>Breed</ThemedText>
            <ThemedText style={[styles.lableText]}>Age</ThemedText>
            <ThemedText style={[styles.lableText]}>Gender</ThemedText>
            {pet?.petWeights?.weightRange && (
              <ThemedText style={[styles.lableText]}>Weight</ThemedText>
            )}
            <ThemedText style={styles.lableText}>Spayed/Neutered</ThemedText>
          </View>
          <View>
            <ThemedText style={[styles.label]}>:</ThemedText>
            <ThemedText style={[styles.label]}>:</ThemedText>
            <ThemedText style={[styles.label]}>:</ThemedText>
            <ThemedText style={[styles.label]}>:</ThemedText>
            {pet?.petWeights?.weightRange && (
              <ThemedText style={styles.label}>:</ThemedText>
            )}
          </View>
          <View style={{ paddingLeft: 10 }}>
            <View>
              <ThemedText style={styles.lableValue}> {pet?.breed} </ThemedText>
              <View style={styles.dottedStyle}></View>
            </View>
            <View>
              <ThemedText style={styles.lableValue}>
                {" "}
                {pet?.age ? pet?.age : 0}
              </ThemedText>
              <View style={styles.dottedStyle}></View>
            </View>
            <View>
              {pet?.gender !== null ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ThemedText style={styles.lableValue}>
                    {" "}
                    {pet?.gender ? "Male" : "Female"}{" "}
                  </ThemedText>
                  {pet?.gender ? (
                    <Ionicons name="male" size={24} color="black" />
                  ) : (
                    <Ionicons name="female" size={24} color="black" />
                  )}
                </View>
              ) : (
                <ThemedText style={styles.lableValue}>Unknown </ThemedText>
              )}
              <View style={styles.dottedStyle}></View>
            </View>
            {pet?.petWeights?.weightRange && (
              <View>
                <ThemedText style={styles.lableValue}>
                  {" "}
                  {pet?.petWeights?.weightRange}{" "}
                </ThemedText>
                <View style={styles.dottedStyle}></View>
              </View>
            )}
            <View>
              <ThemedText style={styles.lableValue}>
                {" "}
                {pet?.spayedOrNeutered
                  ? "Yes"
                  : pet?.spayedOrNeutered === null
                  ? "Unsure"
                  : "No"}{" "}
              </ThemedText>
              <View style={styles.dottedStyle}></View>
            </View>
          </View>
        </View>
        {pet?.petVaccinations?.length && (
          <View>
            <ThemedText style={styles.vaccineText}>
              {" "}
              Vaccination Records{" "}
            </ThemedText>
            <View style={{ gap: 16 }}>
              {pet.petVaccinations.map((item, idx) => {
                return (
                  <View
                    key={idx}
                    style={{
                      borderWidth: 1,
                      borderColor: blackColor,
                      padding: 8,
                    }}
                  >
                    <ThemedText style={[{ fontSize: 15, width: "50%" }]}>
                      Name: {item?.vaccineName}
                    </ThemedText>
                    <ThemedText>
                      Given at: {formatDateToMDY(item?.vaccinatedAt)}
                    </ThemedText>
                    <ThemedText>
                      Due Date: {formatDateToMDY(item?.nextDueDate)}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          </View>
        )}
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
