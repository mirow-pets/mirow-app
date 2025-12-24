import { z } from "zod";

export const changeEmailSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email()
    .nonempty({ message: "Email is required" }),
  newEmail: z
    .string({ message: "New Email is required" })
    .nonempty({ message: "New Email is required" }),
  otp: z
    .string({ message: "OTP is required" })
    .nonempty({ message: "OTP is required" }),
});

export type TChangeEmail = z.infer<typeof changeEmailSchema>;
