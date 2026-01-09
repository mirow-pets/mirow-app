import { z } from "zod";

export const sendLocationSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export type TSendLocation = z.infer<typeof sendLocationSchema>;
