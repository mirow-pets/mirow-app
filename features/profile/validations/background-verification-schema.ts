import { z } from "zod";

export const backgroundVerificationSchema = z.object({
  country: z.string().default("US"),
  accHolderName: z.string(),
  routingNumber: z.string().length(9, "Routing number must be 9 digits"),
  accNum: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .max(17, "Account number must be at most 17 digits"),
});

export type TBackgroundVerification = z.infer<
  typeof backgroundVerificationSchema
>;
