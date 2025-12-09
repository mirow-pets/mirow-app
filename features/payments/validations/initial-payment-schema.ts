import { z } from "zod";

export const backgroundCheckBackgroundCheckInitialPaymentSchema = z.object({
  amount: z.number(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
});

export type TBackgroundCheckInitialPayment = z.infer<
  typeof backgroundCheckBackgroundCheckInitialPaymentSchema
>;
