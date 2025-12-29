import React from 'react';
import { useSelector } from '@xstate/react';
import type { ActorRefFrom } from 'xstate';
import { appActor, type appMachine } from '../fsm/app.machine';
import type { createMedicalHistoryMachine } from '../fsm/medical.history.machine';

type AppActorRef = ActorRefFrom<typeof appMachine>;
type MedicalHistoryActorRef = ActorRefFrom<ReturnType<typeof createMedicalHistoryMachine>>;

const AppActorContext = React.createContext<AppActorRef | null>(null);

interface AppActorProviderProps {
  children: React.ReactNode;
}

export const AppActorProvider: React.FC<AppActorProviderProps> = ({ children }) => {
  return (
    <AppActorContext.Provider value={appActor}>
      {children}
    </AppActorContext.Provider>
  );
};

export const useAppActor = (): AppActorRef => {
  const actor = React.useContext(AppActorContext);
  if (!actor) {
    throw new Error('useAppActor must be used within AppActorProvider');
  }
  return actor;
};

/**
 * Hook to get the patients actor from the root app machine
 */
export const usePatientsActor = () => {
  const appActor = useAppActor();
  const snapshot = appActor.getSnapshot();
  
  if (!snapshot.context.patientsRef) {
    throw new Error('Patients actor not initialized');
  }
  
  return snapshot.context.patientsRef;
};

/**
 * Hook to get or create a medical history actor for a specific patient
 */
export const useMedicalHistoryActor = (patientId: string | undefined): MedicalHistoryActorRef | null => {
  const appActor = useAppActor();
  
  React.useEffect(() => {
    if (patientId) {
      // Request the actor - will be created if doesn't exist
      appActor.send({ type: 'GET_MEDICAL_HISTORY_ACTOR', patientId });
    }
  }, [patientId, appActor]);
  
  // Use useSelector to reactively get the actor from context
  const actor = useSelector(
    appActor,
    (state) => {
      if (!patientId) return null;
      const actorFromMap = state.context.medicalHistoryRefs.get(patientId);
      // Type assertion after getting from Map - we know it's the correct type
      return (actorFromMap as MedicalHistoryActorRef | undefined) ?? null;
    }
  );
  
  return actor;
};
