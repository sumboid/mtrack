import { z } from 'zod';
import { makeIDGen } from './id';
import { MedicalRecordCategorySchema } from './config';

export const generateRecordId = makeIDGen('REC');

export type MedicalRecordCategory = z.infer<typeof MedicalRecordCategorySchema>;
export type RecordType = 'point' | 'continuous';

// Base schema - all records have these fields
const BaseMedicalRecordSchema = z.object({
  id: z.string().regex(/^REC-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/),
  patientId: z.string().regex(/^PAT-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[0123456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}$/),
  category: MedicalRecordCategorySchema,
  type: z.enum(['point', 'continuous']),
  
  // All records have a date (for sorting and reference)
  date: z.coerce.date(),
  
  // Continuous records have start/end dates
  startDate: z.coerce.date().optional(),
  endDate: z.preprocess(
    (val) => val === null || val === undefined ? undefined : val,
    z.coerce.date().optional()
  ),
  
  // Notes field - common to all records
  notes: z.string().optional(),
  
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Category-specific field schemas (exported for use in forms)
export const SurgeryFieldsSchema = z.object({
  surgeryType: z.string().optional(),
  location: z.string().optional(),
  surgeon: z.string().optional(),
  outcome: z.string().optional(),
  complications: z.string().optional(),
});

export const ChemotherapyFieldsSchema = z.object({
  regimen: z.string().optional(),
  cycles: z.coerce.number().optional(),
  response: z.enum(['complete-response', 'partial-response', 'stable-disease', 'progressive-disease', 'not-assessed']).optional(),
  sideEffects: z.string().optional(),
});

export const RadiotherapyFieldsSchema = z.object({
  targetArea: z.string().optional(),
  totalDose: z.coerce.number().optional(),
  fractions: z.coerce.number().optional(),
  technique: z.string().optional(),
  sideEffects: z.string().optional(),
});

export const ImmunotherapyFieldsSchema = z.object({
  agent: z.string().optional(),
  response: z.enum(['complete-response', 'partial-response', 'stable-disease', 'progressive-disease', 'not-assessed']).optional(),
  sideEffects: z.string().optional(),
});

export const LabTestFieldsSchema = z.object({
  testType: z.string().optional(),
  results: z.string().optional(),
});

export const ImagingFieldsSchema = z.object({
  imagingType: z.string().optional(),
  findings: z.string().optional(),
});

export const HospitalizationFieldsSchema = z.object({
  reason: z.string().optional(),
  department: z.string().optional(),
  outcome: z.string().optional(),
});

export const DiagnosisFieldsSchema = z.object({
  diagnosisCode: z.string().optional(),
  diagnosisName: z.string().optional(),
});

export const FollowUpFieldsSchema = z.object({
  findings: z.string().optional(),
  plan: z.string().optional(),
});

export const ConsultationFieldsSchema = z.object({
  specialist: z.string().optional(),
  reason: z.string().optional(),
  recommendations: z.string().optional(),
});

export const OtherFieldsSchema = z.object({
  description: z.string().optional(),
});

// TypeScript types for category-specific fields
export type SurgeryFields = z.infer<typeof SurgeryFieldsSchema>;
export type ChemotherapyFields = z.infer<typeof ChemotherapyFieldsSchema>;
export type RadiotherapyFields = z.infer<typeof RadiotherapyFieldsSchema>;
export type ImmunotherapyFields = z.infer<typeof ImmunotherapyFieldsSchema>;
export type LabTestFields = z.infer<typeof LabTestFieldsSchema>;
export type ImagingFields = z.infer<typeof ImagingFieldsSchema>;
export type HospitalizationFields = z.infer<typeof HospitalizationFieldsSchema>;
export type DiagnosisFields = z.infer<typeof DiagnosisFieldsSchema>;
export type FollowUpFields = z.infer<typeof FollowUpFieldsSchema>;
export type ConsultationFields = z.infer<typeof ConsultationFieldsSchema>;
export type OtherFields = z.infer<typeof OtherFieldsSchema>;

// Full record schemas (base + category-specific fields)
export const SurgeryRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('surgery'),
}).merge(SurgeryFieldsSchema);

export const ChemotherapyRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('chemotherapy'),
}).merge(ChemotherapyFieldsSchema);

export const RadiotherapyRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('radiotherapy'),
}).merge(RadiotherapyFieldsSchema);

export const ImmunotherapyRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('immunotherapy'),
}).merge(ImmunotherapyFieldsSchema);

export const LabTestRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('lab_test'),
}).merge(LabTestFieldsSchema);

export const ImagingRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('imaging'),
}).merge(ImagingFieldsSchema);

export const HospitalizationRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('hospitalization'),
}).merge(HospitalizationFieldsSchema);

export const DiagnosisRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('diagnosis'),
}).merge(DiagnosisFieldsSchema);

export const FollowUpRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('follow_up'),
}).merge(FollowUpFieldsSchema);

export const ConsultationRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('consultation'),
}).merge(ConsultationFieldsSchema);

export const OtherRecordSchema = BaseMedicalRecordSchema.extend({
  category: z.literal('other'),
}).merge(OtherFieldsSchema);

// Union type for all medical records
export const MedicalHistoryRecordSchema = z.discriminatedUnion('category', [
  SurgeryRecordSchema,
  ChemotherapyRecordSchema,
  RadiotherapyRecordSchema,
  ImmunotherapyRecordSchema,
  LabTestRecordSchema,
  ImagingRecordSchema,
  HospitalizationRecordSchema,
  DiagnosisRecordSchema,
  FollowUpRecordSchema,
  ConsultationRecordSchema,
  OtherRecordSchema,
]);

export type MedicalHistoryRecord = z.infer<typeof MedicalHistoryRecordSchema>;
export type SurgeryRecord = z.infer<typeof SurgeryRecordSchema>;
export type ChemotherapyRecord = z.infer<typeof ChemotherapyRecordSchema>;
export type RadiotherapyRecord = z.infer<typeof RadiotherapyRecordSchema>;
export type ImmunotherapyRecord = z.infer<typeof ImmunotherapyRecordSchema>;
export type LabTestRecord = z.infer<typeof LabTestRecordSchema>;
export type ImagingRecord = z.infer<typeof ImagingRecordSchema>;
export type HospitalizationRecord = z.infer<typeof HospitalizationRecordSchema>;
export type DiagnosisRecord = z.infer<typeof DiagnosisRecordSchema>;
export type FollowUpRecord = z.infer<typeof FollowUpRecordSchema>;
export type ConsultationRecord = z.infer<typeof ConsultationRecordSchema>;
export type OtherRecord = z.infer<typeof OtherRecordSchema>;

export const isOngoing = (record: MedicalHistoryRecord): boolean => {
  return record.type === 'continuous' && !record.endDate;
};

export const getDuration = (record: MedicalHistoryRecord): number => {
  if (record.type !== 'continuous' || !record.startDate) return 0;

  const endDate = record.endDate || new Date();
  return Math.floor((endDate.getTime() - record.startDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const createPointRecord = (
  data: {
    patientId: string;
    category: MedicalRecordCategory;
    date: Date;
  } & Partial<Omit<MedicalHistoryRecord, 'id' | 'patientId' | 'category' | 'date' | 'type' | 'createdAt' | 'updatedAt'>>
): MedicalHistoryRecord => {
  const now = new Date();
  const baseData = {
    id: generateRecordId(),
    patientId: data.patientId,
    category: data.category,
    type: 'point' as const,
    date: data.date,
    createdAt: now,
    updatedAt: now,
  };
  
  return MedicalHistoryRecordSchema.parse({ ...baseData, ...data });
};

export const createContinuousRecord = (
  data: {
    patientId: string;
    category: MedicalRecordCategory;
    date: Date;
    startDate: Date;
    endDate?: Date | null;
  } & Partial<Omit<MedicalHistoryRecord, 'id' | 'patientId' | 'category' | 'date' | 'type' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'>>
): MedicalHistoryRecord => {
  const now = new Date();
  const baseData = {
    id: generateRecordId(),
    patientId: data.patientId,
    category: data.category,
    type: 'continuous' as const,
    date: data.date,
    startDate: data.startDate,
    endDate: data.endDate === null ? undefined : data.endDate,
    createdAt: now,
    updatedAt: now,
  };
  
  return MedicalHistoryRecordSchema.parse({ ...baseData, ...data });
};

