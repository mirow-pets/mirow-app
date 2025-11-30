import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { Href, useRouter } from "expo-router";

import { Button } from "@/components/button/Button";
import AuthScreenLayout from "@/components/layout/AuthScreenLayout";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/users";

export default function SelectRoleScreen() {
  const { userRole, setUserRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userRole) router.push(`/${userRole}` as Href);
  }, [userRole, router]);

  return (
    <AuthScreenLayout
      image={require("@/assets/images/select-role-image.png")}
      title="LET'S GET YOU STARTED!"
      subTitle="Create an account or sign in as"
    >
      <View style={styles.container}>
        <Button
          onPress={() => {
            setUserRole(UserRole.PetOwner);
            router.push("/pet-owner/sign-up");
          }}
          title="Pet owner"
          color="secondary"
        />
        <View style={{ marginVertical: 4 }} />
        <Button
          onPress={() => {
            setUserRole(UserRole.CareGiver);
            router.push("/caregiver/sign-up");
          }}
          title="Pet Caregiver"
          color="secondary"
          variant="reversed"
        />
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 32 },
});
