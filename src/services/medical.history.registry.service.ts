import { createActor } from 'xstate';
import { createMedicalHistoryMachine } from '../fsm/medical.history.machine';

// Registry to store medical history machine actors by patientId
const medicalHistoryRegistry = new Map<string, ReturnType<typeof createActor<ReturnType<typeof createMedicalHistoryMachine>>>>();

/**
 * Get or create a medical history machine actor for a patient
 * This ensures the same machine is reused when navigating back to a patient
 */
export const getMedicalHistoryActor = (patientId: string) => {
  let actor = medicalHistoryRegistry.get(patientId);
  
  if (!actor) {
    const machine = createMedicalHistoryMachine(patientId);
    actor = createActor(machine);
    actor.start();
    medicalHistoryRegistry.set(patientId, actor);
  }
  
  return actor;
};

/**
 * Clear a specific patient's medical history actor
 * Useful when a patient is deleted
 */
export const clearMedicalHistoryActor = (patientId: string) => {
  const actor = medicalHistoryRegistry.get(patientId);
  if (actor) {
    actor.stop();
    medicalHistoryRegistry.delete(patientId);
  }
};

/**
 * Clear all medical history actors
 * Useful for cleanup or testing
 */
export const clearAllMedicalHistoryActors = () => {
  medicalHistoryRegistry.forEach(actor => actor.stop());
  medicalHistoryRegistry.clear();
};
