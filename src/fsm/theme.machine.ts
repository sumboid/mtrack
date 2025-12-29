import { createMachine, assign } from 'xstate';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContext {
  mode: ThemeMode;
}

type ThemeEvent =
  | { type: 'TOGGLE' }
  | { type: 'SET_MODE'; mode: ThemeMode };

const getInitialMode = (): ThemeMode => {
  const savedMode = localStorage.getItem('themeMode');
  return (savedMode === 'light' || savedMode === 'dark') ? savedMode : 'dark';
};

export const themeMachine = createMachine({
  id: 'theme',
  initial: 'idle',
  types: {} as {
    context: ThemeContext;
    events: ThemeEvent;
  },
  context: {
    mode: getInitialMode(),
  },
  states: {
    idle: {
      on: {
        TOGGLE: {
          actions: assign({
            mode: ({ context }) => {
              const newMode = context.mode === 'light' ? 'dark' : 'light';
              localStorage.setItem('themeMode', newMode);
              return newMode;
            },
          }),
        },
        SET_MODE: {
          actions: assign({
            mode: ({ event }) => {
              localStorage.setItem('themeMode', event.mode);
              return event.mode;
            },
          }),
        },
      },
    },
  },
});
