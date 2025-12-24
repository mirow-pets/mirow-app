import { z } from "zod";

export const enableNotificationSchema = z.object({
  notificationPreferenceId: z.number(),
  isEnable: z.boolean(),
});

export type TEnableNotification = z.infer<typeof enableNotificationSchema>;
