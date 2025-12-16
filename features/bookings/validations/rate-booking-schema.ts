import { z } from "zod";

export const rateBookingSchema = z.object({
  feedback: z.string().optional(),
  starrating: z.number({ message: "Rating is required" }),
  careGiversId: z.string().uuid(),
  serviceTypesId: z.number(),
  bookingsId: z.string().uuid(),
  tipAmount: z.number().optional(),
});

export type TRateBooking = z.infer<typeof rateBookingSchema>;
