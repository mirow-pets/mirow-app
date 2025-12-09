import { z } from "zod";

export const rejectBookingSchema = z.object({
  bookingId: z.string().uuid(),
  careGiverQeueuId: z.number(),
  rejectReason: z.string({ message: "Reason is required" }),
});

export type TRejectBooking = z.infer<typeof rejectBookingSchema>;
