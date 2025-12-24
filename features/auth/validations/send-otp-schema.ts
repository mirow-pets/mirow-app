import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email()
    .nonempty({ message: "Email is required" }),
  role: z.enum(["petowner", "caregiver"], { message: "Role is required" }),
  type: z.enum(["2fa", "email-update", "password-update"], {
    message: "Type is required",
  }),
});

export type TSendOtp = z.infer<typeof sendOtpSchema>;
