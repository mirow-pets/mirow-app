import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/use-auth";

export default function IndexScreen() {
  const { userRole } = useAuth();

  if (userRole) return <Redirect href={`/${userRole}`} />;

  return <Redirect href="/home" />;
}
