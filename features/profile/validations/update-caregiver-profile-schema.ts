import { z } from "zod";

export const updateCaregiverProfileSchema = z.object({
  firstName: z.string({ message: "First name is required" }),
  lastName: z.string({ message: "Last name is required" }),
  phone: z.string({ message: "Phone number is required" }),
  eFirstName: z.string({ message: "First name is required" }),
  eLastName: z.string({ message: "Last name is required" }),
  ePhone: z.string({ message: "Phone number is required" }),
  relationshipName: z.string({ message: "Relationship is required" }),
  careGiverPreferences: z.number().array().min(1, "Preference is required"),
  careGiverSkills: z.number().array().min(1, "Skill is required"),
  experience: z.coerce.number(),
  petTypes: z.number().array().min(1, "Pet type is required"),
  profileImage: z.string(),
  bioDescription: z.string().optional(),
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
    }, "You must be at least 18 years old"),
  customerId: z.string().optional(),
});

export type TUpdateCaregiverProfile = z.infer<
  typeof updateCaregiverProfileSchema
>;
