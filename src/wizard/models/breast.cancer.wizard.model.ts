import type { MedicalRecordCategory } from '../../models/medical.history.model';
import { createContinuousRecord } from '../../models/medical.history.model';

export type WizardStepType = 
  | 'first-treatment'
  | 'treatment-details'
  | 'next-treatment'
  | 'summary';

export type TumorStage = 'I' | 'II' | 'III' | 'IV';
export type TumorT = 'T0' | 'Tis' | 'T1' | 'T1a' | 'T1b' | 'T1c' | 'T2' | 'T3' | 'T4' | 'T4a' | 'T4b' | 'T4c' | 'T4d';
export type TumorN = 'N0' | 'N1' | 'N1a' | 'N1b' | 'N1c' | 'N2' | 'N2a' | 'N2b' | 'N3' | 'N3a' | 'N3b' | 'N3c';
export type TumorM = 'M0' | 'M1';
export type TumorLocalization = 'left' | 'right' | 'both';
export type MetastaticStatus = 'early' | 'metastatic';

export type ReceptorStatus = '0' | 'low' | '+';
export type HER2Status = '0' | 'low' | '+' | 'IHC2+FISH+' | 'IHC2+FISH-';
export type TumorGrade = 'G1' | 'G2' | 'G3';
export type TumorType = 'invasive-nst' | 'lobular' | 'other';

export type BreastCancerSubtype = 
  | 'luminal-a'
  | 'luminal-b-her2-negative'
  | 'luminal-b-her2-positive'
  | 'her2-positive'
  | 'triple-negative';

export type FirstTreatmentType =
  | 'surgery'
  | 'neoadjuvant-chemotherapy'
  | 'neoadjuvant-targeted'
  | 'neoadjuvant-endocrine'
  | 'palliative';

export type SurgeryType = 
  | 'sectoral'
  | 'mastectomy'
  | 'reconstruction';

export type SystemicTherapyType =
  | 'chemotherapy'
  | 'targeted'
  | 'endocrine'
  | 'immunotherapy';

export type TreatmentGoal =
  | 'neoadjuvant'
  | 'adjuvant'
  | 'first-line-metastatic'
  | 'second-line-metastatic'
  | 'third-line-metastatic'
  | 'palliative'
  | 'other';

export type TreatmentResponse = 
  | 'complete-response'
  | 'partial-response'
  | 'stable-disease'
  | 'progressive-disease'
  | 'not-assessed';

export type NextTreatmentType =
  | 'surgery'
  | 'radiation'
  | 'chemotherapy'
  | 'targeted'
  | 'endocrine'
  | 'immunotherapy'
  | 'palliative'
  | 'other';

export interface SurgeryData {
  date: Date;
  surgeryType: SurgeryType;
  lymphodissectionVolume?: string;
  pathologyPT?: string;
  pathologyPN?: string;
  rStatus?: string;
}

export interface SystemicTherapyData {
  type: SystemicTherapyType;
  regimen: string;
  startDate: Date;
  endDate?: Date;
  response?: TreatmentResponse;
}

export interface FirstTreatmentData {
  type: FirstTreatmentType;
  surgery?: SurgeryData;
  systemicTherapy?: SystemicTherapyData;
}

export interface TreatmentStepData {
  type: NextTreatmentType;
  name: string;
  startDate: Date;
  endDate?: Date;
  goal: TreatmentGoal;
  goalOther?: string;
  response?: TreatmentResponse;
  sideEffects?: string;
  surgery?: SurgeryData;
  systemicTherapy?: SystemicTherapyData;
}

export interface WizardData {
  patientId: string;
  firstTreatment?: FirstTreatmentData;
  treatments: TreatmentStepData[];
}

export interface WizardStep {
  id: string;
  type: WizardStepType;
  title: string;
  description?: string;
  validate?: (data: WizardData) => boolean;
  getNextStep?: (data: WizardData) => string | null;
}

export interface WizardFlow {
  diseaseType: MedicalRecordCategory;
  steps: WizardStep[];
  initialStep: string;
}

export interface WizardOutput {
  records: MedicalHistoryRecord[];
  metadata: {
    wizardType: 'breast-cancer';
    completedAt: Date;
    totalSteps: number;
  };
}

export type MedicalHistoryRecord = {
  id: string;
  patientId: string;
  category: MedicalRecordCategory;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  treatment?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const calculateStage = (t: TumorT, n: TumorN, m: TumorM): TumorStage => {
  if (m === 'M1') return 'IV';
  
  if (t === 'T4' || n === 'N3' || n === 'N3a' || n === 'N3b' || n === 'N3c') return 'III';
  
  if (t === 'T3' || n === 'N2' || n === 'N2a' || n === 'N2b') return 'III';
  
  if (t === 'T2' && (n === 'N1' || n === 'N1a' || n === 'N1b' || n === 'N1c')) return 'II';
  
  if ((t === 'T0' || t === 'Tis' || t === 'T1' || t === 'T1a' || t === 'T1b' || t === 'T1c') && n === 'N0') return 'I';
  
  return 'II';
};

export const calculateSubtype = (data: {
  er: ReceptorStatus;
  pr: ReceptorStatus;
  her2: HER2Status;
  ki67?: number;
}): BreastCancerSubtype => {
  const { er, pr, her2, ki67 } = data;
  
  const isHormonalPositive = er === '+' || er === 'low' || pr === '+' || pr === 'low';
  const isHER2Positive = her2 === '+' || her2 === 'IHC2+FISH+';
  
  if (!isHormonalPositive && !isHER2Positive) {
    return 'triple-negative';
  }
  
  if (isHER2Positive && !isHormonalPositive) {
    return 'her2-positive';
  }
  
  if (isHormonalPositive && isHER2Positive) {
    return 'luminal-b-her2-positive';
  }
  
  if (isHormonalPositive && !isHER2Positive) {
    if (ki67 !== undefined && ki67 < 20) {
      return 'luminal-a';
    }
    return 'luminal-b-her2-negative';
  }
  
  return 'luminal-a';
};

export const mapTreatmentTypeToCategory = (type: FirstTreatmentType | NextTreatmentType): MedicalRecordCategory => {
  switch (type) {
    case 'surgery':
      return 'surgery';
    case 'neoadjuvant-chemotherapy':
    case 'chemotherapy':
      return 'chemotherapy';
    case 'neoadjuvant-targeted':
    case 'targeted':
      return 'immunotherapy';
    case 'neoadjuvant-endocrine':
    case 'endocrine':
      return 'chemotherapy';
    case 'radiation':
      return 'radiotherapy';
    case 'immunotherapy':
      return 'immunotherapy';
    case 'palliative':
    case 'other':
      return 'other';
    default:
      return 'other';
  }
};

export const convertWizardToRecords = (data: WizardData): MedicalHistoryRecord[] => {
  const records: MedicalHistoryRecord[] = [];
  
  if (data.firstTreatment) {
    if (data.firstTreatment.surgery) {
      const surgeryRecord = createContinuousRecord({
        patientId: data.patientId,
        category: 'surgery' as const,
        date: data.firstTreatment.surgery.date,
        startDate: data.firstTreatment.surgery.date,
        surgeryType: data.firstTreatment.surgery.surgeryType,
        notes: formatSurgeryNotes(data.firstTreatment.surgery),
      } as any);
      records.push(surgeryRecord);
    }
    
    if (data.firstTreatment.systemicTherapy) {
      const category = mapSystemicTherapyToCategory(data.firstTreatment.systemicTherapy.type);
      if (category === 'chemotherapy') {
        const record = createContinuousRecord({
          patientId: data.patientId,
          category: 'chemotherapy' as const,
          date: data.firstTreatment.systemicTherapy.startDate,
          startDate: data.firstTreatment.systemicTherapy.startDate,
          endDate: data.firstTreatment.systemicTherapy.endDate,
          regimen: data.firstTreatment.systemicTherapy.regimen,
          response: data.firstTreatment.systemicTherapy.response,
        } as any);
        records.push(record);
      } else if (category === 'immunotherapy') {
        const record = createContinuousRecord({
          patientId: data.patientId,
          category: 'immunotherapy' as const,
          date: data.firstTreatment.systemicTherapy.startDate,
          startDate: data.firstTreatment.systemicTherapy.startDate,
          endDate: data.firstTreatment.systemicTherapy.endDate,
          agent: data.firstTreatment.systemicTherapy.regimen,
          response: data.firstTreatment.systemicTherapy.response,
        } as any);
        records.push(record);
      }
    }
  }
  
  data.treatments.forEach((treatment) => {
    if (treatment.type === 'surgery' && treatment.surgery) {
      const surgeryRecord = createContinuousRecord({
        patientId: data.patientId,
        category: 'surgery' as const,
        date: treatment.startDate,
        startDate: treatment.startDate,
        endDate: treatment.endDate,
        surgeryType: treatment.surgery.surgeryType,
        notes: [
          formatSurgeryNotes(treatment.surgery),
          `Goal: ${formatGoal(treatment.goal, treatment.goalOther)}`,
          treatment.response ? `Response: ${formatResponse(treatment.response)}` : '',
          treatment.sideEffects || '',
        ].filter(Boolean).join('\n'),
      } as any);
      records.push(surgeryRecord);
    } else if (treatment.systemicTherapy) {
      const category = mapSystemicTherapyToCategory(treatment.systemicTherapy.type);
      if (category === 'chemotherapy') {
        const record = createContinuousRecord({
          patientId: data.patientId,
          category: 'chemotherapy' as const,
          date: treatment.startDate,
          startDate: treatment.startDate,
          endDate: treatment.endDate,
          regimen: treatment.systemicTherapy.regimen,
          response: treatment.response,
          sideEffects: treatment.sideEffects,
          notes: `Goal: ${formatGoal(treatment.goal, treatment.goalOther)}`,
        } as any);
        records.push(record);
      } else if (category === 'immunotherapy') {
        const record = createContinuousRecord({
          patientId: data.patientId,
          category: 'immunotherapy' as const,
          date: treatment.startDate,
          startDate: treatment.startDate,
          endDate: treatment.endDate,
          agent: treatment.systemicTherapy.regimen,
          response: treatment.response,
          sideEffects: treatment.sideEffects,
          notes: `Goal: ${formatGoal(treatment.goal, treatment.goalOther)}`,
        } as any);
        records.push(record);
      }
    } else {
      const category = mapTreatmentTypeToCategory(treatment.type);
      const record = createContinuousRecord({
        patientId: data.patientId,
        category,
        date: treatment.startDate,
        startDate: treatment.startDate,
        endDate: treatment.endDate,
        notes: [
          treatment.name,
          `Goal: ${formatGoal(treatment.goal, treatment.goalOther)}`,
          treatment.response ? `Response: ${formatResponse(treatment.response)}` : '',
          treatment.sideEffects || '',
        ].filter(Boolean).join('\n'),
      } as any);
      records.push(record);
    }
  });
  
  return records;
};

const formatSurgeryNotes = (surgery: SurgeryData): string => {
  const lines = [
    surgery.lymphodissectionVolume ? `Lymphodissection: ${surgery.lymphodissectionVolume}` : '',
    surgery.pathologyPT ? `pT: ${surgery.pathologyPT}` : '',
    surgery.pathologyPN ? `pN: ${surgery.pathologyPN}` : '',
    surgery.rStatus ? `R-status: ${surgery.rStatus}` : '',
  ];
  return lines.filter(Boolean).join('\n');
};

const formatGoal = (goal: TreatmentGoal, goalOther?: string): string => {
  if (goal === 'other' && goalOther) return goalOther;
  return goal.replace(/-/g, ' ');
};

const formatResponse = (response: TreatmentResponse): string => {
  return response.replace(/-/g, ' ');
};

const mapSystemicTherapyToCategory = (type: SystemicTherapyType): MedicalRecordCategory => {
  switch (type) {
    case 'chemotherapy':
      return 'chemotherapy';
    case 'targeted':
      return 'immunotherapy';
    case 'endocrine':
      return 'chemotherapy';
    case 'immunotherapy':
      return 'immunotherapy';
    default:
      return 'other';
  }
};

export const breastCancerWizardFlow: WizardFlow = {
  diseaseType: 'diagnosis',
  initialStep: 'first-treatment',
  steps: [
    {
      id: 'first-treatment',
      type: 'first-treatment',
      title: 'wizard.breastCancer.firstTreatment.title',
      description: 'wizard.breastCancer.firstTreatment.description',
      validate: (data) => {
        return !!data.firstTreatment?.type;
      },
      getNextStep: (data) => {
        if (data.firstTreatment?.type === 'surgery') {
          return 'surgery-details';
        }
        return 'systemic-therapy-details';
      },
    },
    {
      id: 'surgery-details',
      type: 'treatment-details',
      title: 'wizard.breastCancer.surgeryDetails.title',
      validate: (data) => {
        return !!data.firstTreatment?.surgery?.date &&
               !!data.firstTreatment?.surgery?.surgeryType;
      },
      getNextStep: () => 'next-treatment',
    },
    {
      id: 'systemic-therapy-details',
      type: 'treatment-details',
      title: 'wizard.breastCancer.systemicTherapyDetails.title',
      validate: (data) => {
        return !!data.firstTreatment?.systemicTherapy?.type &&
               !!data.firstTreatment?.systemicTherapy?.regimen &&
               !!data.firstTreatment?.systemicTherapy?.startDate;
      },
      getNextStep: () => 'next-treatment',
    },
    {
      id: 'next-treatment',
      type: 'next-treatment',
      title: 'wizard.breastCancer.nextTreatment.title',
      description: 'wizard.breastCancer.nextTreatment.description',
      getNextStep: (data) => {
        const lastTreatment = data.treatments[data.treatments.length - 1];
        if (lastTreatment) {
          return 'treatment-step-details';
        }
        return 'summary';
      },
    },
    {
      id: 'treatment-step-details',
      type: 'treatment-details',
      title: 'wizard.breastCancer.treatmentDetails.title',
      validate: (data) => {
        const lastTreatment = data.treatments[data.treatments.length - 1];
        return !!lastTreatment?.type &&
               !!lastTreatment?.name &&
               !!lastTreatment?.startDate &&
               !!lastTreatment?.goal;
      },
      getNextStep: () => 'next-treatment',
    },
    {
      id: 'summary',
      type: 'summary',
      title: 'wizard.breastCancer.summary.title',
      description: 'wizard.breastCancer.summary.description',
      getNextStep: () => null,
    },
  ],
};
