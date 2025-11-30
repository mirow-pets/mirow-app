import { z } from "zod";

export const editPetSchema = z.object({
  petId: z.string(),
  name: z.string({ message: "Name is required" }),
  petTypesId: z.coerce.number({
    message: "Pet type is required",
  }),
  breed: z.string({ message: "Breed is required" }),
  age: z.coerce.number({ message: "Age is required" }),
  gender: z.boolean().optional().nullable(),
  spayedOrNeutered: z.boolean().optional().nullable(),
  careGiverNotes: z.string().optional().nullable(),
  petVaccinations: z
    .object({
      vaccinatedAt: z.date(),
      nextDueDate: z.date(),
      vaccineName: z.string({ message: "Vaccine name is required" }),
    })
    .array(),
  profileImage: z.string().optional().nullable(),
  petWeightsId: z.number().optional().nullable(),
});

export type TEditPet = z.infer<typeof editPetSchema>;
