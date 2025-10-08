import { z } from 'zod';
import { makeIDGen } from './id';
import { CategoryDefs, MedicalRecordCategorySchema } from './config';

export const generateRecordId = makeIDGen('REC');

export type MedicalRecordCategory = z.infer<typeof MedicalRecordCategorySchema>;

export const MedicalHistoryRecordSchema = z.object({
  id: z.string().regex(/^REC-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/),
  patientId: z.string().regex(/^PAT-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/),
  category: MedicalRecordCategorySchema,
  
  date: z.coerce.date(),
  
  startDate: z.coerce.date().optional(),
  endDate: z.preprocess(
    (val) => val === null || val === undefined ? undefined : val,
    z.coerce.date().optional()
  ),
  
  treatment: z.string().optional(),
  notes: z.string().optional(),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).refine(
  (data) => {
    const config = CategoryDefs[data.category];
    if (config.type === 'continuous') {
      return !!data.startDate;
    }
    return true;
  },
  {
    message: 'Continuous events must have a startDate',
  }
);

export type MedicalHistoryRecord = z.infer<typeof MedicalHistoryRecordSchema>;

export const isOngoing = (record: MedicalHistoryRecord): boolean => {
  const config = CategoryDefs[record.category];
  return config.type === 'continuous';
};

export const getDuration = (record: MedicalHistoryRecord): number => {
  if (!record.startDate) return 0;

  return Math.floor((record.startDate.getTime() - (record.endDate ?? new Date()).getTime()) / (1000 * 60 * 60 * 24));
};

export const createPointRecord = (
  data: {
    patientId: string;
    category: MedicalRecordCategory;
    date: Date;
    treatment?: string;
    notes?: string;
  }
): MedicalHistoryRecord => {
  const now = new Date();
  return MedicalHistoryRecordSchema.parse({
    id: generateRecordId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  });
};

export const createContinuousRecord = (
  data: {
    patientId: string;
    category: MedicalRecordCategory;
    date: Date;
    startDate: Date;
    endDate?: Date | null;
    treatment?: string;
    notes?: string;
  }
): MedicalHistoryRecord => {
  const now = new Date();
  return MedicalHistoryRecordSchema.parse({
    id: generateRecordId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  });
};
