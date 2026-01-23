import { z } from "zod";

import { Gender } from "@/types/users";

export const signUpSchema = z
  .object({
    profileImage: z.string().optional(),
    firstName: z
      .string({ message: "First name is required" })
      .nonempty("First name is required"),
    lastName: z
      .string({ message: "Last name is required" })
      .nonempty("Last name is required"),
    gender: z.nativeEnum(Gender, { message: "Gender is required" }),
    dateOfBirth: z
      .date({ message: "Date of birth is required" })
      .refine((val) => {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        return val <= eighteenYearsAgo;
      }, "You must be at least 13 years old"),

    phone: z
      .string({ message: "Phone is required" })
      .nonempty("Phone is required"),
    address: z
      .string({ message: "Address is required" })
      .nonempty("Address is required"),
    city: z
      .string({ message: "City is required" })
      .nonempty("City is required"),
    state: z
      .string({ message: "State is required" })
      .nonempty("State is required"),
    country: z
      .string({ message: "Country is required" })
      .nonempty("Country is required"),
    postalCode: z
      .string({ message: "Postal code is required" })
      .nonempty("Postal code is required"),

    username: z
      .string({ message: "Username is required" })
      .nonempty("Username is required"),
    email: z
      .string({ message: "Email is required" })
      .email()
      .nonempty("Email is required"),

    password: z
      .string({ message: "Password is required" })
      .nonempty("Password is required"),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .nonempty("Confirm password is required"),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type TSignUp = z.infer<typeof signUpSchema>;
