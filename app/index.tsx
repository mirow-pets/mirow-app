import { useEffect } from "react";

import { Redirect, router } from "expo-router";

import { useAuth } from "@/hooks/use-auth";

export default function HomeScreen() {
  const { userRole } = useAuth();

  console.log("userRole", userRole);

  useEffect(() => {
    router.replace("/home");
  }, []);

  if (userRole) return <Redirect href={`/${userRole}`} />;

  return null;
}
