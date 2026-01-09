import { z } from "zod";

export const backgroundCheckBackgroundCheckInitialPaymentSchema = z.object({
  amount: z.number(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  promoCode: z.string().optional(),
});

export type TBackgroundCheckInitialPayment = z.infer<
  typeof backgroundCheckBackgroundCheckInitialPaymentSchema
>;
