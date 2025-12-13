import { View } from "react-native";

import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { redColor, whiteColor } from "@/constants/theme";
import { TUpdateCaregiverProfile } from "@/features/profile/validations";
import { useCaregiverProfile } from "@/hooks/caregiver/use-caregiver-profile";
import { useThemeColor } from "@/hooks/use-theme-color";

export const CaregiverProfileDetailsCard = () => {
  const primaryColor = useThemeColor({}, "primary");

  const { profile, profileCompletion, updateProfile } = useCaregiverProfile();

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
          src={profile?.users?.profileImage}
          isEditable
          size={72}
          onChange={(profileImage) =>
            updateProfile({ profileImage } as TUpdateCaregiverProfile)
          }
          borderColor={
            profileCompletion?.isProfileImageAdded ? "unset" : redColor
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
            {profile?.users.firstName} {profile?.users.lastName}
          </ThemedText>
          <ThemedText style={{ fontSize: 16, color: whiteColor }}>
            {profile?.users.email}
          </ThemedText>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>Profile progress</ThemedText>
        <ThemedText>{profileCompletion?.percentage}%</ThemedText>
      </View>
    </View>
  );
};
