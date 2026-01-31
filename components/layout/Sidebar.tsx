import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTheme } from "react-native-paper";

import { whiteColor } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { getStatusBarHeight } from "@/utils";

import { UserAvatar } from "../image/UserAvatar";
import { ThemedText } from "../themed-text";

interface MenuItemProps {
  icon?: ReactNode;
  label: string;
  onPress: () => void;
}

const MenuItem = ({ icon, label, onPress }: MenuItemProps) => (
  <TouchableOpacity
    style={{
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: "#F0F0F0",
      borderRadius: 16,
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
    }}
    onPress={onPress}
  >
    {icon}
    <ThemedText type="defaultSemiBold" style={{ fontSize: 12, flex: 1 }}>
      {label}
    </ThemedText>
    {label !== "Logout" && (
      <Feather name="chevron-right" size={24} color="black" />
    )}
  </TouchableOpacity>
);

export interface SidebarProps {
  profileImage?: string;
  fullName: string;
  email: string;
  menus: MenuItemProps[];
  /** Pass the drawer's navigation from drawerContent(props) => <Sidebar drawerNavigation={props.navigation} /> so close works */
  drawerNavigation?: { dispatch: (_action: unknown) => void };
}

export const Sidebar = ({
  profileImage,
  fullName,
  email,
  menus,
  drawerNavigation,
}: SidebarProps) => {
  const theme = useTheme();
  const rootNavigation = useNavigation();
  const statusBarHeight = getStatusBarHeight();
  const { logout } = useAuth();

  const closeDrawer = () => {
    const nav = drawerNavigation ?? rootNavigation;
    nav.dispatch(DrawerActions.closeDrawer());
  };

  const handleMenuPress = (onPress: () => void) => () => {
    closeDrawer();
    onPress();
  };

  return (
    <View style={{ backgroundColor: whiteColor, paddingTop: statusBarHeight }}>
      <View style={{ padding: 16 }}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          My Profile
        </ThemedText>
      </View>
      <View style={{ alignItems: "center", padding: 16 }}>
        <UserAvatar src={profileImage} size={80} style={{ marginBottom: 16 }} />
        <ThemedText
          type="subtitle"
          style={{
            color: theme.colors.primary,
            fontSize: 24,
            lineHeight: 24,
          }}
        >
          {fullName}
        </ThemedText>
        <ThemedText style={{ fontSize: 11 }}>{email}</ThemedText>
      </View>
      <View style={{ gap: 16, padding: 32 }}>
        {menus.map((menu, i) => (
          <MenuItem key={i} {...menu} onPress={handleMenuPress(menu.onPress)} />
        ))}
        <MenuItem
          icon={<MaterialIcons name="logout" size={24} color="black" />}
          label="Logout"
          onPress={handleMenuPress(logout)}
        />
      </View>
    </View>
  );
};
