import { z } from "zod";

export const payCaregiverSchema = z.object({
  amount: z.number(),
  caregiverId: z.string(),
  bookingId: z.string(),
});

export type TPayCaregiver = z.infer<typeof payCaregiverSchema>;
