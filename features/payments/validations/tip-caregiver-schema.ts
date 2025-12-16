import { z } from "zod";

export const tipCaregiverSchema = z.object({
  amount: z.number(),
  caregiverId: z.string(),
  bookingId: z.string(),
});

export type TTipCaregiver = z.infer<typeof tipCaregiverSchema>;
