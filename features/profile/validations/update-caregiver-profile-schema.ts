import { z } from "zod";

export const updateCaregiverProfileSchema = z.object({
  eFirstName: z.string({ message: "First name is required" }),
  eLastName: z.string({ message: "Last name is required" }),
  ePhone: z.string({ message: "Phone number is required" }),
  relationshipName: z.string({ message: "Relationship is required" }),
  careGiverPreferences: z.number().array().min(1, "Preference is required"),
  careGiverSkills: z.number().array().min(1, "Skill is required"),
  experience: z.coerce.number(),
  petTypes: z.number().array().min(1, "Pet type is required"),
  services: z.number().array().min(1, "Service type is required"),
  transportIds: z.number().array().min(1, "Transport type is required"),
  homeTypesIds: z.number().array().min(1, "Home type is required"),
  pricePerHour: z.coerce.number({ message: "Price per hour is required" }),
  pricePerService: z.coerce.number({
    message: "Price per service is required",
  }),
  pricePerMile: z.coerce.number({ message: "Price per mile is required" }),
  profileImage: z.string(),
  bioDescription: z.string().optional(),
});

export type TUpdateCaregiverProfile = z.infer<
  typeof updateCaregiverProfileSchema
>;
