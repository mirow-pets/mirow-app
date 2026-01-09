import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
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
import { TCurrentUser, UserRole } from "@/types/users";
import { confirm } from "@/utils";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// import { postLogout } from "../Service/authSvc";
// import { initializeSocket } from "../Service/socketSvc";

export interface AuthContextValue {
  token?: string;
  currUser?: TCurrentUser;
  setCurrUser: Dispatch<SetStateAction<TCurrentUser | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  isInitializing: boolean;
  logout: () => void;
  isLoggingOut: boolean;
  removeInformationsForLogout: () => void;
  userRole?: UserRole;
  setUserRole: Dispatch<SetStateAction<UserRole | undefined>>;
  isPetOwner?: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userRole, setUserRole] = useState<UserRole>();
  const [token, setToken] = useState<string>();
  const [currUser, setCurrUser] = useState<TCurrentUser>();
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
      // const res = await postLogout({ sessionId: currUser?.sessionId });
      // console.log("postLogout res", res);
      // if (res?.message) {
      await removeInformationsForLogout();
      // }
    } catch (error) {
      console.log("error", await error);
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

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
      if (accessToken) setToken(accessToken);
      if (currUser) setCurrUser(currUser);
      if (userRole) {
        setUserRole(userRole as UserRole);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsInitializing(false);
    }
  }, [logout]);

  const removeInformationsForLogout = async () => {
    setToken(undefined);
    setCurrUser(undefined);
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("currUser");
    await AsyncStorage.removeItem("is2FAuthVerified");
    // await GoogleSignin?.signOut();
    // await GoogleSignin.revokeAccess();
    router.replace("/");
  };

  useEffect(() => {
    getUserAuthendication();
  }, [getUserAuthendication]);

  useEffect(() => {
    if (!user) return;

    const check = async () => {
      const fcmToken = await AsyncStorage.getItem("fcmToken");

      if (
        !user?.sessions?.some(
          (session: { deviceToken?: string }) =>
            session?.deviceToken === fcmToken
        )
      ) {
        confirm({
          title: "Session has expired",
          description: "Please relogin",
          onConfirm: logout,
          hideCancel: true,
        });
      }
    };
    check();
  }, [user, logout]);

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
        setCurrUser,
        setToken,
        isInitializing,
        logout,
        isLoggingOut,
        removeInformationsForLogout,
        userRole,
        setUserRole,
        isPetOwner,
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
