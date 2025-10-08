import { DB } from '../db'
import type { Patient } from '../models/patient.model'
import type { MedicalHistoryRecord } from '../models/medical.history.model'

export async function exportDataToJSON(): Promise<string> {
  const patients = await DB.table<Patient>('patients').toArray()
  const medicalHistory = await DB.table<MedicalHistoryRecord>('medicalHistory').toArray()
  
  const backup = {
    version: 1,
    timestamp: new Date().toISOString(),
    data: {
      patients,
      medicalHistory
    }
  }
  
  return JSON.stringify(backup, null, 2)
}

export async function importDataFromJSON(jsonString: string): Promise<{ success: boolean; error?: string }> {
  try {
    const backup = JSON.parse(jsonString)
    
    if (!backup.data || !backup.data.patients || !backup.data.medicalHistory) {
      return { success: false, error: 'Invalid backup format' }
    }
    
    await DB.table('patients').bulkAdd(backup.data.patients)
    await DB.table('medicalHistory').bulkAdd(backup.data.medicalHistory)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Download backup file
 */
export function downloadBackup(jsonData: string) {
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meditrack-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
