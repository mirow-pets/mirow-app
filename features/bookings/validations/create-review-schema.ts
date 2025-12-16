import { z } from "zod";

export const createReviewSchema = z.object({
  feedback: z.string().optional(),
  starrating: z.number({ message: "Rating is required" }),
  careGiversId: z.string().uuid(),
  serviceTypesId: z.number(),
  bookingsId: z.string().uuid(),
});

export type TCreateReview = z.infer<typeof createReviewSchema>;
