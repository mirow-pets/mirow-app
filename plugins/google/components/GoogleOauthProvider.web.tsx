import { ReactNode } from "react";

import { GoogleOAuthProvider as BaseGoogleOAuthProvider } from "@react-oauth/google";

import { ENV } from "@/env";

export interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export const GoogleOAuthProvider = ({ children }: GoogleOAuthProviderProps) => {
  return (
    <BaseGoogleOAuthProvider clientId={ENV.GOOGLE_WEB_CLIENT_ID}>
      {children}
    </BaseGoogleOAuthProvider>
  );
};
