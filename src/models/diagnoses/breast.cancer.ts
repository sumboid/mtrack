import { z } from 'zod';

export const TumorStageSchema = z.enum(['I', 'II', 'III', 'IV']);
export const TumorTSchema = z.enum(['T0', 'Tis', 'T1', 'T1a', 'T1b', 'T1c', 'T2', 'T3', 'T4', 'T4a', 'T4b', 'T4c', 'T4d']);
export const TumorNSchema = z.enum(['N0', 'N1', 'N1a', 'N1b', 'N1c', 'N2', 'N2a', 'N2b', 'N3', 'N3a', 'N3b', 'N3c']);
export const TumorMSchema = z.enum(['M0', 'M1']);
export const TumorLocalizationSchema = z.enum(['left', 'right', 'both']);
export const MetastaticStatusSchema = z.enum(['early', 'metastatic']);
export const ReceptorStatusSchema = z.enum(['0', 'low', '+']);
export const HER2StatusSchema = z.enum(['0', 'low', '+', 'IHC2+FISH+', 'IHC2+FISH-']);
export const TumorGradeSchema = z.enum(['G1', 'G2', 'G3']);
export const TumorTypeSchema = z.enum(['invasive-nst', 'lobular', 'other']);
export const BreastCancerSubtypeSchema = z.enum([
    'luminal-a',
    'luminal-b-her2-negative',
    'luminal-b-her2-positive',
    'her2-positive',
    'triple-negative'
]);

export const BreastCancerSchema = z.object({
    diagnosis: z.literal('breast-cancer'),
    details: z.object({
        localization: TumorLocalizationSchema,
        tnmT: TumorTSchema,
        tnmN: TumorNSchema,
        tnmM: TumorMSchema,
        stage: TumorStageSchema.optional(),
        metastaticStatus: MetastaticStatusSchema,
        tumorType: TumorTypeSchema,
        tumorTypeOther: z.string().optional(),
        er: ReceptorStatusSchema,
        pr: ReceptorStatusSchema,
        her2: HER2StatusSchema,
        ki67: z.number().min(0).max(100).optional(),
        grade: TumorGradeSchema,
        subtype: BreastCancerSubtypeSchema.optional(),
    }),
});

export type BreastCancer = z.infer<typeof BreastCancerSchema>;