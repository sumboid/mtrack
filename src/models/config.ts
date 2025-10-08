import { z } from 'zod';
import { type MedicalRecordCategory } from './medical.history.model';

export const MedicalRecordCategorySchema = z.enum([
    'diagnosis',
    'follow_up',
    'surgery',
    'chemotherapy',
    'radiotherapy',
    'immunotherapy',
    'hospitalization',
    'lab_test',
    'imaging',
    'consultation',
    'other',
]);

export const CategoryConfigSchema = z.object({
    name: z.string(),
    translationKey: z.string(),
    category: MedicalRecordCategorySchema,
    type: z.enum(['point', 'continuous']),
    color: z.string().optional(),
    icon: z.string().optional(),
    fields: z.object({
        treatment: z.boolean(),
        notes: z.boolean(),
    }),
});

export type CategoryConfig = z.infer<typeof CategoryConfigSchema>;

export const CategoryDefs: Record<MedicalRecordCategory, CategoryConfig> = {
    diagnosis: {
        name: 'Diagnosis',
        translationKey: 'categories.diagnosis',
        category: 'diagnosis',
        type: 'point',
        color: 'category.diagnosis',
        fields: { treatment: false, notes: true },
    },
    follow_up: {
        name: 'Follow-up Visit',
        translationKey: 'categories.followUp',
        category: 'follow_up',
        type: 'point',
        color: 'category.followUp',
        fields: { treatment: false, notes: true },
    },
    surgery: {
        name: 'Surgery',
        translationKey: 'categories.surgery',
        category: 'surgery',
        type: 'continuous',
        color: 'category.surgery',
        fields: { treatment: true, notes: true },
    },
    chemotherapy: {
        name: 'Chemotherapy',
        translationKey: 'categories.chemotherapy',
        category: 'chemotherapy',
        type: 'continuous',
        color: 'category.chemotherapy',
        fields: { treatment: true, notes: true },
    },
    radiotherapy: {
        name: 'Radiotherapy',
        translationKey: 'categories.radiotherapy',
        category: 'radiotherapy',
        type: 'continuous',
        color: 'category.radiotherapy',
        fields: { treatment: true, notes: true },
    },
    immunotherapy: {
        name: 'Immunotherapy',
        translationKey: 'categories.immunotherapy',
        category: 'immunotherapy',
        type: 'continuous',
        color: 'category.immunotherapy',
        fields: { treatment: true, notes: true },
    },
    hospitalization: {
        name: 'Hospitalization',
        translationKey: 'categories.hospitalization',
        category: 'hospitalization',
        type: 'continuous',
        color: 'category.hospitalization',
        fields: { treatment: false, notes: true },
    },
    lab_test: {
        name: 'Lab Test',
        translationKey: 'categories.labTest',
        category: 'lab_test',
        type: 'point',
        color: 'category.labTest',
        fields: { treatment: false, notes: true },
    },
    imaging: {
        name: 'Imaging',
        translationKey: 'categories.imaging',
        category: 'imaging',
        type: 'point',
        color: 'category.imaging',
        fields: { treatment: false, notes: true },
    },
    consultation: {
        name: 'Consultation',
        translationKey: 'categories.consultation',
        category: 'consultation',
        type: 'point',
        color: 'category.consultation',
        fields: { treatment: true, notes: true },
    },
    other: {
        name: 'Other',
        translationKey: 'categories.other',
        category: 'other',
        type: 'point',
        color: 'category.other',
        fields: { treatment: true, notes: true },
    },
};
