import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

import { io, Socket } from "socket.io-client";

import { ENV } from "@/env";

// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// import { postLogout } from "../Service/authSvc";
// import { initializeSocket } from "../Service/socketSvc";

export interface SocketContextValue {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const socketRef = useRef(
    io(`${ENV.API_BASE_URL}/socket`, {
      transports: ["websocket"],
      autoConnect: false,
    })
  );

  useEffect(() => {
    const socket = socketRef.current;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  const auth = useContext(SocketContext);

  if (!auth) {
    throw new Error("Cannot use useSocket outside SocketContextProvider");
  }
  return auth;
};
