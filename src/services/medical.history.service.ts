import { DB } from '../db';
import { MedicalHistoryRecordSchema, type MedicalHistoryRecord } from '../models/medical.history.model';

export class MedicalHistoryService {
  async list(patientId: string): Promise<MedicalHistoryRecord[]> {
    const data = await DB.table('medicalHistory')
      .where('patientId')
      .equals(patientId)
      .toArray();
    
    return data.map(record => MedicalHistoryRecordSchema.parse(record));
  }

  async add(record: MedicalHistoryRecord): Promise<void> {
    await DB.table('medicalHistory').add(record);
  }

  async update(record: MedicalHistoryRecord): Promise<void> {
    await DB.table('medicalHistory').put(record);
  }

  async delete(id: string): Promise<void> {
    await DB.table('medicalHistory').delete(id);
  }

  async get(id: string): Promise<MedicalHistoryRecord | undefined> {
    const data = await DB.table('medicalHistory').get(id);
    return data ? MedicalHistoryRecordSchema.parse(data) : undefined;
  }
}

export const medicalHistoryService = new MedicalHistoryService();
