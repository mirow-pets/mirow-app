import { z } from "zod";

export const addPaymentMethodSchema = z
  .object({
    brand: z.string(),
    complete: z.boolean(),
    expiryMonth: z.number(),
    expiryYear: z.number(),
    last4: z.string(),
    postalCode: z.string(),
    validCVC: z.string(),
    validExpiryDate: z.string(),
    validNumber: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  })
  .refine(({ complete, validCVC, validExpiryDate, validNumber }) => {
    return (
      complete &&
      validCVC === "Valid" &&
      validExpiryDate === "Valid" &&
      validNumber === "Valid"
    );
  });

export type TAddPaymentMethod = z.infer<typeof addPaymentMethodSchema>;
