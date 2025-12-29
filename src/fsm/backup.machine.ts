import { createMachine, assign, fromPromise } from 'xstate';
import {
  exportDataToJSON,
  importDataFromJSON,
  downloadBackup,
} from '../services/backup.service';

export interface BackupContext {
  dialogOpen: boolean;
  importing: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export type BackupEvent =
  | { type: 'OPEN_DIALOG' }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'EXPORT' }
  | { type: 'IMPORT'; file: File }
  | { type: 'DISMISS_MESSAGE' };

export const backupMachine = createMachine({
  id: 'backup',
  initial: 'idle',
  types: {} as {
    context: BackupContext;
    events: BackupEvent;
  },
  context: {
    dialogOpen: false,
    importing: false,
    message: null,
  },
  states: {
    idle: {
      on: {
        OPEN_DIALOG: {
          actions: assign({ dialogOpen: true, message: null }),
        },
        CLOSE_DIALOG: {
          actions: assign({ dialogOpen: false, message: null }),
        },
        EXPORT: {
          target: 'exporting',
        },
        IMPORT: {
          target: 'importing',
        },
        DISMISS_MESSAGE: {
          actions: assign({ message: null }),
        },
      },
    },
    exporting: {
      invoke: {
        src: fromPromise(async () => {
          const jsonData = await exportDataToJSON();
          downloadBackup(jsonData);
          return { success: true };
        }),
        onDone: {
          target: 'idle',
          actions: assign({
            message: () => ({ type: 'success' as const, text: 'backup.export.success' }),
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            message: () => ({ type: 'error' as const, text: 'backup.export.errorFailed' }),
          }),
        },
      },
    },
    importing: {
      entry: assign({ importing: true }),
      invoke: {
        src: fromPromise(async ({ input }: { input: { file: File } }) => {
          const text = await input.file.text();
          return await importDataFromJSON(text);
        }),
        input: ({ event }) => {
          if (event.type === 'IMPORT') {
            return { file: event.file };
          }
          throw new Error('Invalid event type');
        },
        onDone: {
          target: 'idle',
          actions: assign({
            importing: false,
            message: ({ event }) =>
              event.output.success
                ? { type: 'success' as const, text: 'backup.import.success' }
                : { type: 'error' as const, text: event.output.error || 'backup.import.errorFailed' },
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            importing: false,
            message: () => ({ type: 'error' as const, text: 'backup.import.errorRead' }),
          }),
        },
      },
    },
  },
});
