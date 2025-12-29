import { createMachine, assign } from 'xstate';
import type { BreastCancer } from '../models/diagnoses/breast.cancer';
import type { DiagnosisType } from '../components/diagnoses/diagnosis.factory.component';
import { createBreastCancerFormMachine, type BreastCancerFormMachine } from './breast.cancer.form.machine';

export interface DiagnosisConfigContext {
  type: DiagnosisType;
  details: BreastCancer['details'];
  breastCancerFormRef?: unknown;
}

type DiagnosisConfigEvent =
  | { type: 'CHANGE_TYPE'; value: DiagnosisType }
  | { type: 'CHANGE_FIELD'; field: keyof BreastCancer['details']; value: string | number | undefined }
  | { type: 'CHANGE_KI67'; value: number | undefined };

const getDefaultBreastCancerDetails = (): BreastCancer['details'] => ({
  localization: 'left',
  tnmT: 'T1',
  tnmN: 'N0',
  tnmM: 'M0',
  metastaticStatus: 'early',
  tumorType: 'invasive-nst',
  er: '0',
  pr: '0',
  her2: '0',
  grade: 'G2',
});

export const createDiagnosisConfigMachine = (
  initialType: DiagnosisType,
  initialDetails?: BreastCancer['details'],
) => {
  const details = initialDetails || getDefaultBreastCancerDetails();

  return createMachine({
    id: 'diagnosis-config',
    types: {} as {
      context: DiagnosisConfigContext;
      events: DiagnosisConfigEvent;
    },
    context: {
      type: initialType,
      details,
      breastCancerFormRef: undefined,
    },
    entry: assign({
      breastCancerFormRef: ({ spawn: spawnChild }) =>
        spawnChild(createBreastCancerFormMachine(details), { id: 'breast-cancer-form' }),
    }),
    on: {
      CHANGE_TYPE: [
        {
          guard: ({ event }) => event.value === 'breast-cancer',
          actions: assign({
            type: ({ event }) => event.value,
          }),
        },
      ],
      CHANGE_FIELD: {
        actions: assign(({ context, event }) => {
          const { field, value } = event;
          return {
            details: {
              ...context.details,
              [field]: value as never,
            },
          };
        }),
      },
    },
  });
};
