import { z } from "zod";

export const updateAddressSchema = z.object({
  address: z.string({ message: "Address is required" }),
  city: z.string({ message: "City is required" }),
  state: z.string({ message: "State is required" }),
  country: z.string({ message: "Country is required" }),
  postalCode: z.string({ message: "Postal code is required" }),
});

export type TUpdateAddress = z.infer<typeof updateAddressSchema>;
