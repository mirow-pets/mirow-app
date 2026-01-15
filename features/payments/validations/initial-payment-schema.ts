import { z } from "zod";

export const backgroundCheckBackgroundCheckInitialPaymentSchema = z.object({
  promoCode: z.string().optional(),
});

export type TBackgroundCheckInitialPayment = z.infer<
  typeof backgroundCheckBackgroundCheckInitialPaymentSchema
>;
