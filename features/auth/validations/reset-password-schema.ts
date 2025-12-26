import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .email()
      .nonempty({ message: "Email is required" }),
    password: z
      .string({ message: "New password is required" })
      .nonempty({ message: "New password is required" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .nonempty({ message: "Confirm password is required" }),
    role: z.enum(["petowner", "caregiver"], { message: "Role is required" }),
    otp: z
      .string({ message: "OTP is required" })
      .nonempty({ message: "OTP is required" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirmation do not match",
  });

export type TResetPassword = z.infer<typeof resetPasswordSchema>;
