import { z } from "zod";

export const updateCaregiverServicesSchema = z.object({
  services: z
    .object({
      id: z.number(),
      serviceRate: z.coerce.number().optional(),
      isActive: z.boolean().default(false),
    })
    .array()
    .min(1, "Service is required"),
  transportIds: z.number().array(),
  homeTypesIds: z.number().array().min(1, "Home type is required"),
});

export type TUpdateCaregiverServices = z.infer<
  typeof updateCaregiverServicesSchema
>;
