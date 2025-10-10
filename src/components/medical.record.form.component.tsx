import React from 'react';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import type { CreatePointRecordParams, CreateContinuousRecordParams } from '../fsm/medical.history.machine';
import { BaseMedicalRecordForm } from './medical.record/base.form.component';
import { CategoryFormFieldsFactory } from './medical.record/category.form.fields.factory';

interface MedicalRecordFormProps {
  mode: 'add' | 'edit';
  patientId: string;
  patientName: string;
  record?: MedicalHistoryRecord;
  onSubmit: (data: CreatePointRecordParams | CreateContinuousRecordParams | MedicalHistoryRecord, keepDialogOpen?: boolean) => void;
  onCancel: () => void;
  compact?: boolean;
  saveAndAddNext?: boolean;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = React.memo(({
  mode,
  patientId,
  patientName,
  record,
  onSubmit,
  onCancel,
  compact = false,
  saveAndAddNext = false,
}) => {
  const [category, setCategory] = React.useState<MedicalRecordCategory>(() => 
    record?.category || 'consultation'
  );

  const [categoryFields, setCategoryFields] = React.useState<Record<string, any>>(() => {
    if (!record) return {};
    const fields: Record<string, any> = {};
    
    switch (record.category) {
      case 'surgery':
        fields.surgeryType = record.surgeryType || '';
        fields.location = record.location || '';
        fields.surgeon = record.surgeon || '';
        fields.outcome = record.outcome || '';
        fields.complications = record.complications || '';
        break;
      case 'chemotherapy':
        fields.regimen = record.regimen || '';
        fields.cycles = record.cycles || '';
        fields.response = record.response || '';
        fields.sideEffects = record.sideEffects || '';
        break;
      case 'radiotherapy':
        fields.targetArea = record.targetArea || '';
        fields.totalDose = record.totalDose || '';
        fields.fractions = record.fractions || '';
        fields.technique = record.technique || '';
        fields.sideEffects = record.sideEffects || '';
        break;
      case 'immunotherapy':
        fields.agent = record.agent || '';
        fields.response = record.response || '';
        fields.sideEffects = record.sideEffects || '';
        break;
      case 'lab_test':
        fields.testType = record.testType || '';
        fields.results = record.results || '';
        break;
      case 'imaging':
        fields.imagingType = record.imagingType || '';
        fields.findings = record.findings || '';
        break;
      case 'hospitalization':
        fields.reason = record.reason || '';
        fields.department = record.department || '';
        fields.outcome = record.outcome || '';
        break;
      case 'diagnosis':
        fields.diagnosisCode = record.diagnosisCode || '';
        fields.diagnosisName = record.diagnosisName || '';
        break;
      case 'follow_up':
        fields.findings = record.findings || '';
        fields.plan = record.plan || '';
        break;
      case 'consultation':
        fields.specialist = record.specialist || '';
        fields.reason = record.reason || '';
        fields.recommendations = record.recommendations || '';
        break;
      case 'other':
        fields.description = record.description || '';
        break;
    }
    return fields;
  });

  const handleCategoryChange = React.useCallback((newCategory: MedicalRecordCategory) => {
    setCategory(newCategory);
    setCategoryFields({});
  }, []);

  const handleCategoryFieldChange = React.useCallback((field: string, value: any) => {
    setCategoryFields(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFormSubmit = React.useCallback((formData: any) => {
    if (mode === 'edit' && record) {
      const updatedRecord: MedicalHistoryRecord = {
        ...record,
        category,
        type: formData.isContinuous ? 'continuous' : 'point',
        date: formData.date,
        startDate: formData.startDate,
        endDate: formData.endDate,
        ...categoryFields,
        notes: formData.notes,
        updatedAt: new Date(),
      } as MedicalHistoryRecord;
      onSubmit(updatedRecord, false);
    } else {
      const recordData = formData.isContinuous ? {
        patientId,
        category,
        date: formData.date,
        startDate: formData.startDate,
        endDate: formData.endDate,
        ...categoryFields,
        notes: formData.notes,
      } : {
        patientId,
        category,
        date: formData.date,
        ...categoryFields,
        notes: formData.notes,
      };
      
      onSubmit(recordData, saveAndAddNext);
      
      if (saveAndAddNext) {
        setCategoryFields({});
      }
    }
  }, [mode, record, category, categoryFields, onSubmit, patientId, saveAndAddNext]);

  return (
    <BaseMedicalRecordForm
      mode={mode}
      patientId={patientId}
      patientName={patientName}
      record={record}
      category={category}
      onCategoryChange={handleCategoryChange}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      compact={compact}
      saveAndAddNext={saveAndAddNext}
    >
      <CategoryFormFieldsFactory
        category={category}
        value={categoryFields}
        onChange={handleCategoryFieldChange}
      />
    </BaseMedicalRecordForm>
  );
});
