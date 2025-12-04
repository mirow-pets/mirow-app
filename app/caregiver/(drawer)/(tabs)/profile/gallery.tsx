import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

import { CaregiverImage } from "@/components/image/CaregiverImage";
import { ImagePicker } from "@/components/image/ImagePicker";
import { ThemedText } from "@/components/themed-text";
import { useCaregiver } from "@/hooks/use-caregiver";
import { useProfile } from "@/hooks/use-profile";

export default function GalleryScreen() {
  const { caregiverProfile } = useProfile();
  const { caregiverGalleries, getCaregiver, uploadImage, isUploadingImage } =
    useCaregiver();

  useEffect(() => {
    getCaregiver(caregiverProfile.usersId);
  }, [caregiverProfile.usersId, getCaregiver]);

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
    justifyContent: "space-around",
    width: "100%",
    gap: 8,
  },
  gridItem: {
    minWidth: "30%",
    maxWidth: "30%",
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
