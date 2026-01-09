import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { Get } from "@/services/http-service";
import { authStore, SetAuthArgs } from "@/stores/auth.store";
import { TCurrentUser, UserRole } from "@/types/users";
import { confirm } from "@/utils";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// import { postLogout } from "../Service/authSvc";
// import { initializeSocket } from "../Service/socketSvc";

export interface AuthContextValue {
  token?: string;
  currUser?: TCurrentUser;
  setAuth: (_input: SetAuthArgs) => Promise<void>;
  isInitializing: boolean;
  logout: () => void;
  isLoggingOut: boolean;
  userRole?: UserRole;
  setUserRole: (_userRole: UserRole) => void;
  removeUserRole: () => Promise<void>;
  setFcmToken: (_fcmToken: string) => Promise<void>;
  isPetOwner?: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    token,
    currUser,
    userRole,
    fcmToken,
    setAuth,
    setUserRole,
    setFcmToken,
    removeAuth,
    removeUserRole,
    removeFcmToken,
  } = authStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user", currUser?.sessionId],
    queryFn: () => Get("/v2/auth/user"),
    enabled: !!token,
  });

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      // await Post(
      //   userRole === UserRole.PetOwner ? `/users/logout` : `/caregivers/logout`,
      //   { sessionId: currUser?.sessionId }
      // );
      await Promise.all([removeAuth(), removeFcmToken()]);

      // await GoogleSignin?.signOut();
      // await GoogleSignin.revokeAccess();
      router.replace("/");
      // }
    } catch (error) {
      console.log("error", await error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [removeAuth, removeFcmToken]);

  const getUserAuthendication = useCallback(async () => {
    try {
      setIsInitializing(true);
      const accessToken = await AsyncStorage.getItem("accessToken");
      const currUserString = await AsyncStorage.getItem("currUser");
      const userRole = await AsyncStorage.getItem("userRole");
      const currUser =
        currUserString && (JSON.parse(currUserString) as TCurrentUser);
      const is2FAuthVerified = await AsyncStorage.getItem("is2FAuthVerified");

      if (is2FAuthVerified) {
        logout();
        setIsInitializing(false);
        return;
      }
      if (accessToken && currUser) setAuth({ token: accessToken, currUser });
      if (userRole) setUserRole(userRole as UserRole);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsInitializing(false);
    }
  }, [logout, setAuth, setUserRole]);

  useEffect(() => {
    getUserAuthendication();
  }, [getUserAuthendication]);

  useEffect(() => {
    if (!user || !fcmToken) return;

    const check = async () => {
      const hasDeviceToken = user?.sessions?.some(
        (session: { deviceToken?: string }) => session?.deviceToken === fcmToken
      );

      if (hasDeviceToken) return;

      confirm({
        title: "Session has expired",
        description: "Please relogin",
        onConfirm: logout,
        hideCancel: true,
      });
    };
    check();
  }, [fcmToken, user, logout]);

  // useEffect(() => {
  //   if (hasToken) {
  //     initializeSocket(token);
  //   }
  // }, [hasToken]);

  const isPetOwner = useMemo(() => userRole === UserRole.PetOwner, [userRole]);

  return (
    <AuthContext.Provider
      value={{
        token,
        currUser,
        setAuth,
        isInitializing,
        logout,
        isLoggingOut,
        userRole,
        setUserRole,
        isPetOwner,
        removeUserRole,
        setFcmToken,
      }}
    >
      {isInitializing ? <ThemedText>Loading...</ThemedText> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("Cannot use useAuth outside AuthContextProvider");
  }
  return auth;
};
