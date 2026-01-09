import { View } from "react-native";

import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { blackColor, redColor, whiteColor } from "@/constants/theme";
import { TUpdatePetOwnerProfile } from "@/features/profile/validations";
import { usePetOwnerProfile } from "@/hooks/pet-owner/use-pet-owner-profile";
import { useThemeColor } from "@/hooks/use-theme-color";

export const PetOwnerProfileDetailsCard = () => {
  const primaryColor = useThemeColor({}, "primary");

  const { profile, profileCompletion, updateProfile } = usePetOwnerProfile();

  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          padding: 16,
          backgroundColor: primaryColor,
          borderRadius: 8,
          flexDirection: "row",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <UserAvatar
          src={profile?.profileImage}
          isEditable
          size={72}
          onChange={(profileImage) =>
            updateProfile({ profileImage } as TUpdatePetOwnerProfile)
          }
          borderColor={
            profileCompletion.isProfileImageAdded ? blackColor : redColor
          }
        />
        <View>
          <ThemedText
            type="title"
            style={{
              color: whiteColor,
              fontSize: 32,
            }}
          >
            {profile?.firstName} {profile?.lastName}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, color: whiteColor }}>
            {profile?.email}
          </ThemedText>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Profile progress</ThemedText>
        <ThemedText>{profileCompletion.percentage}%</ThemedText>
      </View>
    </View>
  );
};
