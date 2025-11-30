import { z } from "zod";

export const addPetSchema = z.object({
  name: z.string({ message: "Name is required" }),
  petTypesId: z.coerce.number({
    message: "Pet type is required",
  }),
  breed: z.string({ message: "Breed is required" }),
  age: z.coerce.number({ message: "Age is required" }),
  gender: z.boolean().optional(),
  spayedOrNeutered: z.boolean().optional(),
  careGiverNotes: z.string().optional(),
  petVaccinations: z
    .object({
      vaccinatedAt: z.date(),
      nextDueDate: z.date(),
      vaccineName: z.string({ message: "Vaccine name is required" }),
    })
    .array(),
  profileImage: z.string().optional(),
  petWeightsId: z.number().optional().nullable(),
});

export type TAddPet = z.infer<typeof addPetSchema>;
