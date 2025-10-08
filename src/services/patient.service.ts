import { DB } from '../db';
import { PatientSchema, type Patient } from '../models/patient.model';

export class PatientService {
  async list(filter?: string): Promise<Patient[]> {
    const table = DB.table('patients');
    const tfilter = filter?.trim();
    const data = tfilter 
        ? table 
            .where('name').startsWithIgnoreCase(tfilter)
            .or('email').startsWithIgnoreCase(tfilter)
            .or('phone').startsWith(tfilter)
            .or('id').startsWithIgnoreCase(tfilter)
        : table;

    return (await data.toArray()).map(p => PatientSchema.parse(p));
  }

  async add(patient: Patient): Promise<void> {
    await DB.table('patients').add(patient);
  }

  async update(patient: Patient): Promise<void> {
    await DB.table('patients').put(patient);
  }

  async delete(id: string): Promise<void> {
    await DB.table('patients').delete(id);
  }

  async get(id: string): Promise<Patient | undefined> {
    const data = await DB.table('patients').get(id);
    return data ? PatientSchema.parse(data) : undefined;
  }
}

export const patientService = new PatientService();
