import { createMachine, assign } from 'xstate';
import type { BreastCancer } from '../models/diagnoses/breast.cancer';

export type BreastCancerFormContext = BreastCancer['details'];

type BreastCancerFormField = keyof BreastCancer['details'];

type BreastCancerFormEvent =
  | { type: 'CHANGE'; field: BreastCancerFormField; value: string | number | undefined }
  | { type: 'CHANGE_KI67'; value: number | undefined };

export const createBreastCancerFormMachine = (initialDetails: BreastCancer['details']) => {
  return createMachine({
    id: 'breast-cancer-form',
    types: {} as {
      context: BreastCancerFormContext;
      events: BreastCancerFormEvent;
    },
    context: initialDetails,
    on: {
      CHANGE: {
        actions: assign(({ event }) => {
          const { field, value } = event;
          const updates: Partial<BreastCancer['details']> = {};
          updates[field] = value as never;
          return updates;
        }),
      },
      CHANGE_KI67: {
        actions: assign({
          ki67: ({ event }) => event.value,
        }),
      },
    },
  });
};

export type BreastCancerFormMachine = ReturnType<typeof createBreastCancerFormMachine>;
