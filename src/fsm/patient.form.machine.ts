import { createMachine, assign, sendTo } from 'xstate';
import type { Patient, PatientData } from '../models/patient.model';
import type { DiagnosisType } from '../components/diagnoses/diagnosis.factory.component';
import type { BreastCancer } from '../models/diagnoses/breast.cancer';
import dayjs from 'dayjs';
import { createDiagnosisConfigMachine } from './diagnosis.config.machine';

export interface PatientFormContext {
  mode: 'add' | 'edit';
  name: string;
  email: string;
  phone: string;
  dateOfBirth: dayjs.Dayjs;
  notes: string;
  errors: Partial<Record<keyof PatientData, string>>;
  diagnosisConfigRef?: unknown;
  output?: PatientData;
}

type PatientFormField = 'name' | 'email' | 'phone' | 'dateOfBirth' | 'notes';

type PatientFormEvent =
  | { type: 'CHANGE'; field: PatientFormField; value: string | dayjs.Dayjs }
  | { type: 'CHANGE_DIAGNOSIS_TYPE'; value: DiagnosisType }
  | { type: 'CHANGE_DIAGNOSIS_DETAILS'; value: BreastCancer['details'] }
  | { type: 'SUBMIT' }
  | { type: 'INITIALIZE'; mode: 'add' | 'edit'; patient?: Patient }
  | { type: 'CANCEL' };

const getDefaultDiagnosisDetails = (): BreastCancer['details'] => ({
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

export const createPatientFormMachine = () => {
  return createMachine({
    id: 'patient-form',
    initial: 'idle',
    types: {} as {
      context: PatientFormContext;
      events: PatientFormEvent;
    },
    context: {
      mode: 'add',
      name: '',
      email: '',
      phone: '',
      dateOfBirth: dayjs(),
      notes: '',
      errors: {},
      diagnosisConfigRef: undefined,
      output: undefined,
    },
    states: {
      idle: {
        on: {
          INITIALIZE: {
            actions: assign(({ event, spawn: spawnChild }) => {
              const patient = event.patient;
              const diagnosisType = (patient?.diagnosis?.diagnosis || 'breast-cancer') as DiagnosisType;
              const diagnosisDetails = 
                patient?.diagnosis?.diagnosis === 'breast-cancer'
                  ? patient.diagnosis.details
                  : getDefaultDiagnosisDetails();
              
              return {
                mode: event.mode,
                name: patient?.name || '',
                email: patient?.email || '',
                phone: patient?.phone || '',
                dateOfBirth: patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : dayjs(),
                notes: patient?.notes || '',
                errors: {},
                output: undefined,
                diagnosisConfigRef: spawnChild(createDiagnosisConfigMachine(diagnosisType, diagnosisDetails), {
                  id: 'diagnosis-config',
                }),
              };
            }),
          },
          CHANGE: {
            actions: [
              assign(({ event }) => {
                const { field, value } = event;
                const updates: Partial<PatientFormContext> = {};
                updates[field] = value as never;
                return updates;
              }),
              assign(({ context, event }) => {
                const { field } = event;
                const newErrors = { ...context.errors };
                delete newErrors[field as keyof PatientData];
                return { errors: newErrors };
              }),
            ],
          },
          CHANGE_DIAGNOSIS_TYPE: {
            actions: sendTo('diagnosis-config', ({ event: e }) => ({
              type: 'CHANGE_TYPE',
              value: e.value,
            })),
          },
          CHANGE_DIAGNOSIS_DETAILS: {
            actions: sendTo('diagnosis-config', ({ event: e }) => ({
              type: 'CHANGE_DETAILS',
              value: e.value,
            })),
          },
          SUBMIT: {
            target: 'validating',
          },
        },
      },
      validating: {
        entry: assign({
          errors: ({ context }) => {
            const newErrors: Partial<Record<keyof PatientData, string>> = {};

            if (!context.name.trim()) {
              newErrors.name = 'Name is required';
            }

            if (!context.email.trim()) {
              newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(context.email)) {
              newErrors.email = 'Email is invalid';
            }

            if (!context.phone.trim()) {
              newErrors.phone = 'Phone is required';
            } else if (context.phone.length < 7 || context.phone.length > 15) {
              newErrors.phone = 'Phone must be between 7 and 15 characters';
            }

            return newErrors;
          },
        }),
        always: [
          {
            guard: ({ context }) => Object.keys(context.errors).length === 0,
            target: 'submitted',
          },
          {
            target: 'idle',
          },
        ],
      },
      submitted: {
        entry: assign(({ context }) => {
          // Type guard for diagnosisConfigRef
          const isValidRef = (ref: unknown): ref is { getSnapshot: () => unknown } => {
            return ref !== null && ref !== undefined && typeof ref === 'object' && 'getSnapshot' in ref;
          };
          
          // Get snapshot safely
          let diagnosisType: DiagnosisType = 'breast-cancer';
          let diagnosisDetails = getDefaultDiagnosisDetails();
          
          if (isValidRef(context.diagnosisConfigRef)) {
            const snapshot = context.diagnosisConfigRef.getSnapshot();
            if (snapshot && typeof snapshot === 'object' && 'context' in snapshot) {
              const snapshotContext = (snapshot as Record<string, unknown>).context;
              if (snapshotContext && typeof snapshotContext === 'object') {
                const ctx = snapshotContext as Record<string, unknown>;
                if ('type' in ctx && ctx.type === 'breast-cancer') {
                  diagnosisType = 'breast-cancer';
                }
                if ('details' in ctx && ctx.details && typeof ctx.details === 'object') {
                  diagnosisDetails = ctx.details as BreastCancer['details'];
                }
              }
            }
          }
          
          return {
            output: {
              name: context.name,
              email: context.email,
              phone: context.phone,
              dateOfBirth: context.dateOfBirth.toDate(),
              diagnosis: {
                diagnosis: diagnosisType,
                details: diagnosisDetails,
              },
              notes: context.notes,
            },
          };
        }),
        after: {
          // Small delay to allow React to see the submitted state
          10: { target: 'idle' }
        },
      },
    },
  });
};
