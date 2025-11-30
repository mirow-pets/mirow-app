import { z } from "zod";

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
  cancelReason: z.string({ message: "Reason is required" }),
});

export type TCancelBooking = z.infer<typeof cancelBookingSchema>;
