import { z } from "zod";

export const payBookingSchema = z.object({
  bookingId: z.string(),
  /** When provided (e.g. web "select card" flow), pay with this saved payment method id instead of card element */
  paymentMethodId: z.string().optional(),
});

export type TPayBooking = z.infer<typeof payBookingSchema>;
