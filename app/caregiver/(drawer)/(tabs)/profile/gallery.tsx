import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { CaregiverImage } from "@/components/image/CaregiverImage";
import { ImagePicker } from "@/components/image/ImagePicker";
import { ThemedText } from "@/components/themed-text";
import { useCaregiverCaregiver } from "@/hooks/caregiver/use-caregiver-caregiver";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";

export default function GalleryScreen() {
  const { profile } = useCaregiverProfile();
  const { caregiverGalleries, getCaregiver, uploadImage, isUploadingImage } =
    useCaregiverCaregiver();

  useEffect(() => {
    getCaregiver(profile.usersId);
  }, [profile.usersId, getCaregiver]);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <ImagePicker
            disabled={isUploadingImage}
            trigger={
              <View style={styles.triggerContainer}>
                {isUploadingImage ? (
                  <ThemedText>Uploading...</ThemedText>
                ) : (
                  <Feather name="plus" size={24} color="black" />
                )}
              </View>
            }
            onSelect={uploadImage}
          />
        </View>
        {caregiverGalleries?.map((gallery, i) => (
          <View key={i} style={styles.gridItem}>
            <CaregiverImage src={gallery.url} size={"100%"} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: "2%",
  },
  gridItem: {
    minWidth: "32%",
    maxWidth: "32%",
    aspectRatio: 1,
    flexDirection: "row",
    height: 30,
  },
  triggerContainer: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
    maxHeight: "100%",
    minWidth: "100%",
  },
});
