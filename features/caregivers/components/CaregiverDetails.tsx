import { StyleSheet, View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { TCaregiver } from "@/types";

import { SetAsFavoriteCaregiver } from "./SetAsFavoriteCaregiver";

export interface CaregiverDetailsProps {
  caregiver: TCaregiver;
}

export const CaregiverDetails = ({ caregiver }: CaregiverDetailsProps) => {
  const {
    users,
    experience,
    serviceTypes,
    petTypes,
    careGiverSkills,
    careGiverPreferences,
  } = caregiver;

  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: "#f7f8fa" }}
    >
      <View style={styles.container}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <UserAvatar src={users.profileImage} size={64} />
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.profileName}>
              {users.firstName} {users.lastName}
            </ThemedText>
            {users.bioDescription && (
              <ThemedText style={styles.profileBio}>
                {users.bioDescription}
              </ThemedText>
            )}
          </View>
          <SetAsFavoriteCaregiver
            userId={caregiver.usersId}
            isFavourite={caregiver.isFavourite}
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCardModern}>
          <ThemedText style={styles.infoLabel}>Contact</ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoKey}>Email:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {users.email || "-"}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoKey}>Phone:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {users.phone || "-"}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoKey}>Experience:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {experience ? `${experience} years` : "-"}
            </ThemedText>
          </View>
        </View>

        {serviceTypes && serviceTypes.length > 0 && (
          <View style={styles.infoCardModern}>
            <ThemedText style={styles.infoLabel}>Services</ThemedText>
            <View style={styles.infoList}>
              {serviceTypes.map((s) => (
                <ThemedText key={s.id} style={styles.infoTag}>
                  {s.display}
                </ThemedText>
              ))}
            </View>
          </View>
        )}

        {petTypes && petTypes.length > 0 && (
          <View style={styles.infoCardModern}>
            <ThemedText style={styles.infoLabel}>Pet Types</ThemedText>
            <View style={styles.infoList}>
              {petTypes.map((p, i) => (
                <ThemedText key={i} style={styles.infoTag}>
                  {p.display || p.type}
                </ThemedText>
              ))}
            </View>
          </View>
        )}

        {careGiverSkills && careGiverSkills.length > 0 && (
          <View style={styles.infoCardModern}>
            <ThemedText style={styles.infoLabel}>Skills</ThemedText>
            <View style={styles.infoList}>
              {careGiverSkills.map((s) => (
                <ThemedText key={s.id} style={styles.infoTag}>
                  {s.skill}
                </ThemedText>
              ))}
            </View>
          </View>
        )}

        {careGiverPreferences && careGiverPreferences.length > 0 && (
          <View style={styles.infoCardModern}>
            <ThemedText style={styles.infoLabel}>Preferences</ThemedText>
            <View style={styles.infoList}>
              {careGiverPreferences.map((p) => (
                <ThemedText key={p.id} style={styles.infoTag}>
                  {p.preference}
                </ThemedText>
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 16,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 18,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F4544",
    marginBottom: 2,
  },
  profileBio: {
    fontSize: 15,
    color: "#404040",
    marginTop: 4,
  },
  infoCardModern: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F4544",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoKey: {
    fontSize: 15,
    color: "#404040",
    width: 90,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: "#000",
    fontWeight: "400",
  },
  infoList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    alignItems: "center",
  },
  infoTag: {
    backgroundColor: "#e6f4f1",
    color: "#0F4544",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
    height: 32,
  },
});
