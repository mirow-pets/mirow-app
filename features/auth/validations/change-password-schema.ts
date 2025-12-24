import { z } from "zod";

export const changePasswordSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email()
      .nonempty({ message: "Email is required" }),
    oldPassword: z
      .string({ message: "Old password is required" })
      .nonempty({ message: "Old password is required" }),
    newPassword: z
      .string({ message: "New password is required" })
      .nonempty({ message: "New password is required" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .nonempty({ message: "Confirm password is required" }),
    otp: z
      .string({ message: "OTP is required" })
      .nonempty({ message: "OTP is required" }),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      path: ["confirmPassword"],
      message: "New password and confirmation do not match",
    }
  );

export type TChangePassword = z.infer<typeof changePasswordSchema>;
