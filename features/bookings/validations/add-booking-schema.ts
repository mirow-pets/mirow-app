import { z } from "zod";

export const addBookingSchema = z.object({
  pets: z
    .string({ message: "Pet is required" })
    .uuid({ message: "Pet is required" })
    .array()
    .min(1, { message: "Pet is required" }),
  petTypes: z
    .number({ message: "Pet types is required" })
    .array()
    .min(1, { message: "Pet types is required" }),
  startDate: z.date({ message: "Service date is required" }),
  notes: z.string().optional(),
  isOpenShift: z.boolean({ message: "Shift type is required" }),
  caregiversIds: z.string().uuid().array(),
});

export type TAddBooking = z.infer<typeof addBookingSchema>;
