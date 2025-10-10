import { z } from 'zod';

import { BreastCancerSchema } from './breast.cancer';

export const DiagnosisSchema = z.discriminatedUnion("diagnosis", [
  BreastCancerSchema,
]);