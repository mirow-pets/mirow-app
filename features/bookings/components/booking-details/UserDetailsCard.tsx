import { ReactNode } from "react";
import { Linking, StyleSheet, View } from "react-native";

import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { blueColor, lightGrayColor } from "@/constants/theme";
import { TUser } from "@/types";

export interface UserDetailsCardProps {
  title: string;
  user: TUser;
  actions?: ReactNode;
}

export const UserDetailsCard = ({
  title,
  user,
  actions,
}: UserDetailsCardProps) => {
  const address = user.address?.[0];

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ marginBottom: 8 }}>
          {title}
        </ThemedText>
        {actions}
      </View>
      <View style={styles.userInfo}>
        <UserAvatar src={user.profileImage} size={64} />
        <View>
          <ThemedText>
            {user.firstName} {user.lastName}
          </ThemedText>
          {user.phone && (
            <View style={styles.phoneContainer}>
              <ThemedText style={styles.smallText}>Phone:</ThemedText>
              <ThemedText
                style={[styles.smallText, styles.linkText]}
                onPress={() => Linking.openURL(`tel:${user.phone}`)}
              >
                {user.phone}
              </ThemedText>
            </View>
          )}
          {address && (
            <ThemedText style={styles.smallText}>
              Address: {address.address},{address.city},{address.state}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    gap: 8,
    backgroundColor: lightGrayColor,
  },
  userInfo: {
    flexDirection: "row",
    gap: 16,
  },
  phoneContainer: {
    flexDirection: "row",
    gap: 4,
  },
  smallText: {
    fontSize: 12,
  },
  linkText: {
    textDecorationLine: "underline",
    color: blueColor,
  },
});
