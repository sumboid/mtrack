import { z } from 'zod';
import { makeIDGen } from './id';
import { DiagnosisSchema } from './diagnoses';

export const generatePatientId = makeIDGen('PAT');


export const PatientDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is too short').max(15, 'Phone number is too long'),
  dateOfBirth: z.coerce.date(),
  diagnosis: DiagnosisSchema,
  notes: z.string().optional(),
});

export type PatientData = z.infer<typeof PatientDataSchema>;

export const PatientSchema = PatientDataSchema.extend({
  id: z.string().regex(/^PAT-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

export const createPatient = (data: PatientData): Patient => {
  const now = new Date();
  return PatientSchema.parse({
    ...data,
    id: generatePatientId(),
    createdAt: now,
    updatedAt: now,
  });
};
