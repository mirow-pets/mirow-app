import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email()
    .nonempty({ message: "Email is required" }),
  otp: z
    .string({ message: "OTP is required" })
    .length(4, { message: "OTP is 4 digit numbers" }),
});

export type TVerifyOtp = z.infer<typeof verifyOtpSchema>;
