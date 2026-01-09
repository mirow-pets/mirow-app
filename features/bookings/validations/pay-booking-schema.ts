import { z } from "zod";

export const payBookingSchema = z.object({
  bookingId: z.string(),
});

export type TPayBooking = z.infer<typeof payBookingSchema>;
