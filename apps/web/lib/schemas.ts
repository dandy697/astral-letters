import { z } from "zod";

export const intakeSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis."),
  email: z.string().email("Email invalide."),
  birthDate: z.string().min(1, "La date est requise."),
  birthTime: z.string().optional(),
  birthLocation: z.string().min(2, "Le lieu de naissance est requis."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement email est requis." })
  })
});

export type IntakeInput = z.infer<typeof intakeSchema>;
