import { createContext, ReactNode, useContext, useState } from "react";

import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { TSendOtp } from "@/features/auth/validations";
import { Post } from "@/services/http-service";
import { onError } from "@/utils";

export interface OtpContextValues {
  otp?: string;
  setOtp: (_otp?: string) => void;
  sendOtp: UseMutateFunction<void, Error, TSendOtp>;
  isSendingOtp: boolean;
}

export const OtpContext = createContext<OtpContextValues | null>(null);

export interface OtpProviderProps {
  children: ReactNode;
}

const OtpProvider = ({ children }: OtpProviderProps) => {
  const [otp, setOtp] = useState<string>();

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: (input: TSendOtp) => Post(`/v2/auth/send-otp`, input),
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "OTP sent successfully!",
      });
    },
    onError,
  });

  return (
    <OtpContext.Provider
      value={{
        otp,
        setOtp,
        sendOtp,
        isSendingOtp,
      }}
    >
      {children}
    </OtpContext.Provider>
  );
};

export default OtpProvider;

export const useOtp = () => {
  const otp = useContext(OtpContext);

  if (!otp) {
    throw new Error("Cannot access useOtp outside OtpProvider");
  }
  return otp;
};
