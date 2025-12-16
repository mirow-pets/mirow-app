import { io } from "socket.io-client";

import { ENV } from "@/env";

// let socket: Socket; // Variable to hold the single socket instance

export const initializeSocket = (token: string) => {
  // if (!socket) {
  // If no existing socket connection, create one
  const socket = io(`${ENV.API_BASE_URL}/socket`, {
    transports: ["websocket"],
    auth: { token },
  });
  // } else {
  //   // Update the token if the socket already exists
  //   socket.auth = { token };
  //   socket.connect(); // Reconnect with updated auth if necessary
  // }

  console.log("Socket initialized:", socket.id); // Log the socket ID for debugging
  return socket;
};
