import { createMachine, assign, fromPromise, sendParent } from 'xstate';
import type { Patient } from '../models/patient.model';
import { patientService } from '../services/patient.service';

export interface PatientContext {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  addDialogOpen: boolean;
}

type PatientEvent =
  | { type: 'SEARCH_PATIENTS'; query: string }
  | { type: 'ADD_PATIENT'; patient: Patient }
  | { type: 'UPDATE_PATIENT'; patient: Patient }
  | { type: 'DELETE_PATIENT'; patientId: string }
  | { type: 'OPEN_ADD_DIALOG' }
  | { type: 'CLOSE_ADD_DIALOG' }
  | { type: 'RETRY' };

export const patientMachine = createMachine({
  id: 'patient',
  initial: 'loading',
  types: {} as {
    context: PatientContext;
    events: PatientEvent;
  },
  context: {
    patients: [],
    loading: false,
    error: null,
    searchQuery: '',
    addDialogOpen: false,
  },
  states: {
    loading: {
      entry: assign({ loading: true, error: null }),
      invoke: {
        src: fromPromise(async () => {
          return await patientService.list();
        }),
        onDone: {
          target: 'success',
          actions: assign({
            patients: ({ event }) => event.output,
            loading: false,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => (event.error as Error)?.message || 'Unknown error',
            loading: false,
          }),
        },
      },
    },
    success: {
      on: {
        SEARCH_PATIENTS: {
          target: 'searching',
        },
        ADD_PATIENT: {
          actions: [
            assign({
              patients: ({ context, event }) => [...context.patients, event.patient],
              addDialogOpen: false,
            }),
            ({ event }) => {
              patientService.add(event.patient).catch(console.error);
            },
          ],
        },
        UPDATE_PATIENT: {
          actions: [
            assign({
              patients: ({ context, event }) =>
                context.patients.map((p) =>
                  p.id === event.patient.id ? event.patient : p
                ),
            }),
            ({ event }) => {
              patientService.update(event.patient).catch(console.error);
            },
          ],
        },
        DELETE_PATIENT: {
          actions: [
            assign({
              patients: ({ context, event }) =>
                context.patients.filter((p) => p.id !== event.patientId),
            }),
            ({ event }) => {
              patientService.delete(event.patientId).catch(console.error);
            },
            // Notify parent machine to clean up medical history actor
            sendParent(({ event }) => ({ type: 'PATIENT_DELETED', patientId: event.patientId })),
          ],
        },
        OPEN_ADD_DIALOG: {
          actions: assign({ addDialogOpen: true }),
        },
        CLOSE_ADD_DIALOG: {
          actions: assign({ addDialogOpen: false }),
        },
      },
    },
    failure: {
      on: {
        RETRY: 'loading',
      },
    },
    searching: {
      entry: assign({ loading: true }),
      invoke: {
        src: fromPromise(async ({ input }) => {
          if (typeof input === 'object' && input !== null && 'query' in input) {
            return {
              patients: await patientService.list(String(input.query)),
              query: String(input.query),
            };
          }
          throw new Error('Invalid input');
        }),
        input: ({ event }) => {
          if (event.type === 'SEARCH_PATIENTS') {
            return { query: event.query };
          }
          return { query: '' };
        },
        onDone: {
          target: 'success',
          actions: assign({
            patients: ({ event }) => event.output.patients,
            searchQuery: ({ event }) => event.output.query,
            loading: false,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: ({ event }) => (event.error as Error)?.message || 'Search failed',
            loading: false,
          }),
        },
      },
    },
  },
});

// No longer export singleton - root machine will spawn this
// export const patientActor = createActor(patientMachine);
// patientActor.start();