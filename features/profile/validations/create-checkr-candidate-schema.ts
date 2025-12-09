import { z } from "zod";

import { backgroundVerificationSchema } from "./background-verification-schema";

export const createCheckrCandidateSchema = backgroundVerificationSchema.merge(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  })
);

export type TCreateCheckrCandidate = z.infer<
  typeof createCheckrCandidateSchema
>;
