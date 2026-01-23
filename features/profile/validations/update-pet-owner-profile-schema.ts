import { z } from "zod";

export const updatePetOwnerProfileSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(1, { message: "First name is required" }),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, { message: "Last name is required" }),
  phone: z.string({ message: "Phone number is required" }),
  eFirstName: z.string({ message: "First name is required" }),
  eLastName: z.string({ message: "Last name is required" }),
  ePhone: z.string({ message: "Phone number is required" }),
  relationshipName: z.string({ message: "Relationship is required" }),
  profileImage: z.string(),
  bioDescription: z.string().optional(),
  address: z.string({ message: "Address is required" }),
  city: z.string({ message: "City is required" }),
  state: z.string({ message: "State is required" }),
  country: z.string({ message: "Country is required" }),
  postalCode: z.string({ message: "Postal code is required" }),
});

export type TUpdatePetOwnerProfile = z.infer<
  typeof updatePetOwnerProfileSchema
>;
