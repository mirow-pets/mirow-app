import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .nonempty("Username is required"),
  password: z
    .string({ message: "Password is required" })
    .nonempty("Password is required"),
  isActivate: z.boolean().optional(),
});

export type TLogin = z.infer<typeof loginSchema>;
