import React from 'react';
import type { MedicalRecordCategory } from '../../models/medical.history.model';
import { SurgeryFormFields } from './surgery.form.fields';
import { ChemotherapyFormFields } from './chemotherapy.form.fields';
import { RadiotherapyFormFields } from './radiotherapy.form.fields';
import { ImmunotherapyFormFields } from './immunotherapy.form.fields';
import { LabTestFormFields } from './lab.test.form.fields';
import { ImagingFormFields } from './imaging.form.fields';
import { HospitalizationFormFields } from './hospitalization.form.fields';
import { DiagnosisFormFields } from './diagnosis.form.fields';
import { FollowUpFormFields } from './follow.up.form.fields';
import { ConsultationFormFields } from './consultation.form.fields';
import { OtherFormFields } from './other.form.fields';

interface CategoryFormFieldsProps {
  category: MedicalRecordCategory;
  value: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const CategoryFormFieldsFactory: React.FC<CategoryFormFieldsProps> = ({
  category,
  value,
  onChange,
}) => {
  switch (category) {
    case 'surgery':
      return <SurgeryFormFields value={value} onChange={onChange} />;
    
    case 'chemotherapy':
      return <ChemotherapyFormFields value={value} onChange={onChange} />;
    
    case 'radiotherapy':
      return <RadiotherapyFormFields value={value} onChange={onChange} />;
    
    case 'immunotherapy':
      return <ImmunotherapyFormFields value={value} onChange={onChange} />;
    
    case 'lab_test':
      return <LabTestFormFields value={value} onChange={onChange} />;
    
    case 'imaging':
      return <ImagingFormFields value={value} onChange={onChange} />;
    
    case 'hospitalization':
      return <HospitalizationFormFields value={value} onChange={onChange} />;
    
    case 'diagnosis':
      return <DiagnosisFormFields value={value} onChange={onChange} />;
    
    case 'follow_up':
      return <FollowUpFormFields value={value} onChange={onChange} />;
    
    case 'consultation':
      return <ConsultationFormFields value={value} onChange={onChange} />;
    
    case 'other':
      return <OtherFormFields value={value} onChange={onChange} />;
    
    default:
      return null;
  }
};
