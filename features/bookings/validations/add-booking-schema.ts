import { z } from "zod";

export const addBookingSchema = z
  .object({
    serviceTypeId: z.number(),
    trainingTypeId: z.number({ message: "Training type is required" }),
    customTrainingType: z.string().optional(),
    petId: z
      .string({ message: "Pet is required" })
      .uuid({ message: "Pet is required" }),
    petTypeId: z.number({ message: "Pet types is required" }),
    startDate: z.date({ message: "Service start date is required" }),
    startTime: z.date({ message: "Service start time is required" }),
    endDate: z.date({ message: "Service end date is required" }),
    endTime: z.date({ message: "Service end time is required" }),
    notes: z.string().optional(),
    isOpenShift: z.boolean({ message: "Shift type is required" }),
    caregiverId: z.string().optional(),
    pickup: z
      .object({
        lat: z.number(),
        lng: z.number(),
        addressText: z.string(),
      })
      .optional(),
    dropOff: z
      .object({
        lat: z.number(),
        lng: z.number(),
        addressText: z.string(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isOpenShift && !data.caregiverId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Caregiver is required",
        path: ["caregiversIds"],
      });
    }
  });

export type TAddBooking = z.infer<typeof addBookingSchema>;
