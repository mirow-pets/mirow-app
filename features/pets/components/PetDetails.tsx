import { ReactNode } from "react";
import { Linking, StyleSheet, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";

import { PetAvatar } from "@/components/image/PetAvatar";
import { ThemedText } from "@/components/themed-text";
import { blackColor, blueColor, lightGrayColor } from "@/constants/theme";
import { TPet } from "@/types";

export interface PetDetailsProps {
  pet: TPet;
  actions?: ReactNode;
}

const InfoRow = ({
  label,
  value,
  isLink = false,
  onPress,
}: {
  label: string;
  value?: string | null;
  isLink?: boolean;
  onPress?: () => void;
}) => (
  <View style={styles.infoRow}>
    <ThemedText type="defaultSemiBold" style={styles.infoRowLabel}>
      {label}:
    </ThemedText>
    <ThemedText
      style={[styles.infoRowValue, isLink && styles.linkText]}
      onPress={onPress}
    >
      {value || "N/A"}
    </ThemedText>
  </View>
);

export const PetDetails = ({ pet, actions }: PetDetailsProps) => {
  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.banner}>
        <PetAvatar src={pet.profileImage} size={100} />
        <View style={{ flex: 1, gap: 4 }}>
          <ThemedText type="defaultSemiBold" style={styles.petNameText}>
            {pet.name}
          </ThemedText>
          <ThemedText style={styles.petTypeText}>
            {pet.petTypes?.display}
          </ThemedText>
        </View>
        {actions}
      </View>

      {/* Pet Overview Section */}
      <View style={styles.card}>
        <InfoRow label="Breed" value={pet.breed} />
        <InfoRow label="Age" value={pet.age ? String(pet.age) : null} />
        <View style={styles.infoRow}>
          <ThemedText type="defaultSemiBold" style={styles.infoRowLabel}>
            Gender:
          </ThemedText>
          {pet?.gender !== null ? (
            <View style={styles.genderContainer}>
              {/* <ThemedText style={styles.infoRowValue}>
                {pet?.gender ? "Male" : "Female"}
              </ThemedText> */}
              {pet?.gender ? (
                <Ionicons name="male" size={16} color={blackColor} />
              ) : (
                <Ionicons name="female" size={16} color={blackColor} />
              )}
            </View>
          ) : (
            <ThemedText style={styles.infoRowValue}>Unknown</ThemedText>
          )}
        </View>
        {pet?.petWeights?.weightRange && (
          <InfoRow
            label="Weight"
            value={`${pet.petWeights.weightRange} ${pet.petWeights.weightType}`}
          />
        )}
        <InfoRow
          label="Spayed/Neutered"
          value={
            pet?.spayedOrNeutered === null
              ? "Unsure"
              : pet?.spayedOrNeutered
              ? "Yes"
              : "No"
          }
        />
      </View>

      {/* Special Instructions/Notes Section */}
      {pet?.careGiverNotes && (
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Special Instructions/Notes
          </ThemedText>
          <View style={styles.notesContainer}>
            <ThemedText style={styles.notesText}>
              {pet?.careGiverNotes}
            </ThemedText>
          </View>
        </View>
      )}

      {/* Veterinary Information Section */}
      {(pet.vetName || pet.phone || pet.Website) && (
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Veterinary Information
          </ThemedText>
          {pet.vetName && <InfoRow label="Vet Name" value={pet.vetName} />}
          {pet.phone && (
            <InfoRow
              label="Vet Phone"
              value={pet.phone}
              isLink
              onPress={() => Linking.openURL(`tel:${pet.phone}`)}
            />
          )}
          {pet.Website && (
            <InfoRow
              label="Vet Website"
              value={pet.Website}
              isLink
              onPress={() => Linking.openURL(pet.Website)}
            />
          )}
        </View>
      )}

      {/* Vaccination Records Section */}
      {/* {pet?.petVaccinations?.length && (
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Vaccination Records
          </ThemedText>
          <View style={{ gap: 12 }}>
            {pet.petVaccinations.map((item, idx) => (
              <View key={idx} style={styles.vaccinationItem}>
                <InfoRow label="Vaccine Name" value={item?.vaccineName} />
                <InfoRow
                  label="Given at"
                  value={formatDateToMDY(item?.vaccinatedAt)}
                />
                <InfoRow
                  label="Next Due Date"
                  value={formatDateToMDY(item?.nextDueDate)}
                />
              </View>
            ))}
          </View>
        </View>
      )} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: lightGrayColor,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  banner: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  petNameText: {
    fontSize: 22,
    color: blackColor,
  },
  petTypeText: {
    fontSize: 14,
    color: blackColor,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: blackColor,
  },
  notesContainer: {
    backgroundColor: "#38b6ff30",
    borderRadius: 8,
    padding: 12,
  },
  notesText: {
    fontSize: 14,
    color: "#525252",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoRowLabel: {
    fontSize: 15,
    color: "#404040",
    flex: 1,
  },
  infoRowValue: {
    fontSize: 15,
    color: blackColor,
    flex: 2,
    textAlign: "right",
  },
  linkText: {
    color: blueColor,
    textDecorationLine: "underline",
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  vaccinationItem: {
    borderWidth: 1,
    borderColor: blackColor,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
});
