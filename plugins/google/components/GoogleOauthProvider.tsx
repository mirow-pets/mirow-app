import { ReactNode } from "react";

export interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export const GoogleOAuthProvider = ({ children }: GoogleOAuthProviderProps) => {
  return children;
};
