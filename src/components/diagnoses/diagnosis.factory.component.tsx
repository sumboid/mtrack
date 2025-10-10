import React from 'react';
import { BreastCancerForm } from './breast.cancer.form.component';
import { BreastCancerDisplay } from './breast.cancer.display.component';
import type { BreastCancer } from '../../models/diagnoses/breast.cancer';

export type DiagnosisType = 'breast-cancer';

export type DiagnosisDetails = BreastCancer['details'];

interface DiagnosisFormFactoryProps {
  type: DiagnosisType;
  value: DiagnosisDetails;
  onChange: (value: DiagnosisDetails) => void;
  errors?: Record<string, string>;
}

export const DiagnosisFormFactory: React.FC<DiagnosisFormFactoryProps> = ({
  type,
  value,
  onChange,
  errors,
}) => {
  switch (type) {
    case 'breast-cancer':
      return (
        <BreastCancerForm
          value={value as BreastCancer['details']}
          onChange={onChange as (value: BreastCancer['details']) => void}
          errors={errors}
        />
      );
    default:
      return null;
  }
};

interface DiagnosisDisplayFactoryProps {
  type: DiagnosisType;
  details: DiagnosisDetails;
}

export const DiagnosisDisplayFactory: React.FC<DiagnosisDisplayFactoryProps> = ({
  type,
  details,
}) => {
  switch (type) {
    case 'breast-cancer':
      return <BreastCancerDisplay details={details as BreastCancer['details']} />;
    default:
      return null;
  }
};
