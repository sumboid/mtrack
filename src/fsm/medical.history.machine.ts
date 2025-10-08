import { createMachine, assign, fromPromise } from 'xstate';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import { createPointRecord, createContinuousRecord } from '../models/medical.history.model';
import { medicalHistoryService } from '../services/medical.history.service';

export interface CreatePointRecordParams {
  patientId: string;
  category: MedicalRecordCategory;
  date: Date;
  treatment?: string;
  notes?: string;
}

export interface CreateContinuousRecordParams {
  patientId: string;
  category: MedicalRecordCategory;
  date: Date;
  startDate: Date;
  endDate?: Date | null;
  treatment?: string;
  notes?: string;
}

export interface MedicalHistoryContext {
  records: MedicalHistoryRecord[];
  selectedRecord: MedicalHistoryRecord | null;
  patientId: string | null;
  categoryFilter: MedicalRecordCategory | 'all';
  loading: boolean;
  error: string | null;
}

type MedicalHistoryEvent =
  | { type: 'ADD_POINT_RECORD'; params: CreatePointRecordParams }
  | { type: 'ADD_CONTINUOUS_RECORD'; params: CreateContinuousRecordParams }
  | { type: 'UPDATE_RECORD'; record: MedicalHistoryRecord }
  | { type: 'DELETE_RECORD'; recordId: string }
  | { type: 'FILTER_BY_CATEGORY'; category: MedicalRecordCategory | 'all' }
  | { type: 'SELECT_RECORD'; record: MedicalHistoryRecord | null }
  | { type: 'RETRY' };

export const getFilteredRecords = (context: MedicalHistoryContext): MedicalHistoryRecord[] => {
  if (context.categoryFilter === 'all') {
    return context.records;
  }
  return context.records.filter(r => r.category === context.categoryFilter);
};

export const createMedicalHistoryMachine = (patientId: string) => createMachine({
  id: `medicalHistory-${patientId}`,
  initial: 'loading',
  types: {} as {
    context: MedicalHistoryContext;
    events: MedicalHistoryEvent;
  },
  context: {
    records: [],
    selectedRecord: null,
    patientId,
    categoryFilter: 'all',
    loading: false,
    error: null,
  },
  states: {
    loading: {
      entry: assign({ loading: true, error: null }),
      invoke: {
        src: fromPromise(async () => {
          return await medicalHistoryService.list(patientId);
        }),
        onDone: {
          target: 'success',
          actions: assign({
            records: ({ event }) => event.output,
            loading: false,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => (event.error as Error)?.message || 'Failed to load records',
            loading: false,
          }),
        },
      },
    },
    success: {
      on: {
        FILTER_BY_CATEGORY: {
          actions: assign({
            categoryFilter: ({ event }) => event.category,
          }),
        },
        SELECT_RECORD: {
          actions: assign({
            selectedRecord: ({ event }) => event.record,
          }),
        },
        ADD_POINT_RECORD: {
          actions: [
            ({ event }) => {
              const record = createPointRecord(event.params);
              console.log('Adding point record:', record);
              medicalHistoryService.add(record)
                .then(() => console.log('Point record saved successfully'))
                .catch(err => console.error('Error saving point record:', err));
            },
            assign({
              records: ({ context, event }) => {
                const record = createPointRecord(event.params);
                return [...context.records, record].sort((a, b) => a.date.getTime() - b.date.getTime());
              },
            }),
          ],
        },
        ADD_CONTINUOUS_RECORD: {
          actions: [
            ({ event }) => {
              const record = createContinuousRecord(event.params);
              console.log('Adding continuous record:', record);
              medicalHistoryService.add(record)
                .then(() => console.log('Continuous record saved successfully'))
                .catch(err => console.error('Error saving continuous record:', err));
            },
            assign({
              records: ({ context, event }) => {
                const record = createContinuousRecord(event.params);
                return [...context.records, record].sort((a, b) => a.date.getTime() - b.date.getTime());
              },
            }),
          ],
        },
        UPDATE_RECORD: {
          actions: [
            ({ event }) => {
              medicalHistoryService.update(event.record).catch(console.error);
            },
            assign({
              records: ({ context, event }) =>
                context.records.map(r => r.id === event.record.id ? event.record : r),
              selectedRecord: ({ context, event }) =>
                context.selectedRecord?.id === event.record.id ? event.record : context.selectedRecord,
            }),
          ],
        },
        DELETE_RECORD: {
          actions: [
            ({ event }) => {
              medicalHistoryService.delete(event.recordId).catch(console.error);
            },
            assign({
              records: ({ context, event }) => context.records.filter(r => r.id !== event.recordId),
              selectedRecord: ({ context, event }) =>
                context.selectedRecord?.id === event.recordId ? null : context.selectedRecord,
            }),
          ],
        },
      },
    },
    failure: {
      on: {
        RETRY: 'loading',
      },
    },
  },
});
