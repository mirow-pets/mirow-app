import { z } from "zod";

export const backgroundVerificationSchema = z.object({
  country: z.string().default("US"),
  accHolderName: z.string({ message: "Account holder name is required" }),
  routingNumber: z
    .string({ message: "Routing number is required" })
    .length(9, "Routing number must be 9 digits"),
  accountNumber: z
    .string({ message: "Account number is required" })
    .min(4, "Account number must be at least 4 digits")
    .max(17, "Account number must be at most 17 digits"),
  // documentTypes: z.number({ message: "Document type is required" }),
  // documentUrl: z
  //   .string({ message: "Please upload a valid document" })
  //   .nonempty({ message: "Please upload a valid document" }),
  drivingLicense: z.string({ message: "Driving license is required" }),
  driverLicenseState: z.string({ message: "Driver license state is required" }),
  ssn: z
    .string({ message: "SSN number is required" })
    .regex(
      /^\d{3}-\d{2}-\d{4}$|^\d{9}$/,
      "Invalid SSN format. Expected XXX-XX-XXXX"
    ),
  dateOfBirth: z
    .date({ message: "Date of birth is required" })
    .refine((val) => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return val <= eighteenYearsAgo;
    }, "You must be at least 13 years old"),
  customerId: z.string().optional().nullable(),
});

export type TBackgroundVerification = z.infer<
  typeof backgroundVerificationSchema
>;
