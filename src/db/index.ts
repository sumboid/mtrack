import { Dexie } from 'dexie';

export const DB = new Dexie('db');
DB.version(1).stores({
  patients: '&id, name, email, phone, dateOfBirth, diagnosis',
  medicalHistory: '&id, patientId, category, type',
});
