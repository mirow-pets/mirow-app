import { z } from "zod";

export const signUpSchema = z.object({
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
  firstName: z
    .string({ message: "First name is required" })
    .nonempty("First name is required"),
  lastName: z
    .string({ message: "Last name is required" })
    .nonempty("Last name is required"),
  phone: z
    .string({ message: "Phone is required" })
    .nonempty("Phone is required"),
  address: z
    .string({ message: "Address is required" })
    .nonempty("Address is required"),
  city: z.string({ message: "City is required" }).nonempty("City is required"),
  state: z
    .string({ message: "State is required" })
    .nonempty("State is required"),
  country: z
    .string({ message: "Country is required" })
    .nonempty("Country is required"),
  postalCode: z
    .string({ message: "Postal code is required" })
    .nonempty("Postal code is required"),
});

export type TSignUp = z.infer<typeof signUpSchema>;
