import { setup, assign, createActor, type ActorRefFrom } from 'xstate';
import { patientMachine } from './list.machine';
import { createMedicalHistoryMachine } from './medical.history.machine';
import type { Patient } from '../models/patient.model';

interface AppContext {
  // Main patient list actor
  patientsRef: ActorRefFrom<typeof patientMachine> | null;
  
  // Medical history actors keyed by patientId
  medicalHistoryRefs: Map<string, unknown>;
}

type AppEvent =
  | { type: 'INITIALIZE' }
  | { type: 'PATIENT_CREATED'; patient: Patient }
  | { type: 'PATIENT_DELETED'; patientId: string }
  | { type: 'GET_MEDICAL_HISTORY_ACTOR'; patientId: string }
  | { type: 'CLEANUP_MEDICAL_HISTORY_ACTOR'; patientId: string };

export const appMachine = setup({
  types: {} as {
    context: AppContext;
    events: AppEvent;
  },
  actors: {
    patientMachine,
  },
}).createMachine({
  id: 'app',
  initial: 'initializing',
  context: {
    patientsRef: null,
    medicalHistoryRefs: new Map(),
  },
  states: {
    initializing: {
      entry: assign({
        // Create and start the patient list actor
        patientsRef: ({ spawn }) => spawn(patientMachine, { syncSnapshot: true }),
      }),
      always: { target: 'ready' },
    },
    ready: {
      on: {
        GET_MEDICAL_HISTORY_ACTOR: {
          actions: assign({
            medicalHistoryRefs: ({ context, event, spawn }) => {
              const refs = new Map(context.medicalHistoryRefs);
              
              // Only create if doesn't exist
              if (!refs.has(event.patientId)) {
                const machine = createMedicalHistoryMachine(event.patientId);
                const actor = spawn(machine, { syncSnapshot: true });
                refs.set(event.patientId, actor);
              }
              
              return refs;
            },
          }),
        },
        PATIENT_DELETED: {
          actions: assign({
            medicalHistoryRefs: ({ context, event }) => {
              const refs = new Map(context.medicalHistoryRefs);
              
              // Stop and remove the actor
              const actor = refs.get(event.patientId);
              if (actor && typeof actor === 'object' && 'stop' in actor && typeof actor.stop === 'function') {
                actor.stop();
              }
              refs.delete(event.patientId);
              
              return refs;
            },
          }),
        },
        CLEANUP_MEDICAL_HISTORY_ACTOR: {
          actions: assign({
            medicalHistoryRefs: ({ context, event }) => {
              const refs = new Map(context.medicalHistoryRefs);
              
              const actor = refs.get(event.patientId);
              if (actor && typeof actor === 'object' && 'stop' in actor && typeof actor.stop === 'function') {
                actor.stop();
              }
              refs.delete(event.patientId);
              
              return refs;
            },
          }),
        },
      },
    },
  },
});

// Create and start the root actor
export const appActor = createActor(appMachine);
appActor.start();
