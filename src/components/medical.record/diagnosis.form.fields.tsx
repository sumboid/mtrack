import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { DiagnosisFields } from '../../models/medical.history.model';

export interface DiagnosisFormFieldsProps {
  value: DiagnosisFields;
  onChange: (field: string, value: any) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };

export const DiagnosisFormFields: React.FC<DiagnosisFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleDiagnosisCodeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('diagnosisCode', e.target.value),
    [onChange]
  );

  const handleDiagnosisNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('diagnosisName', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.diagnosisCode')}
          value={value.diagnosisCode || ''}
          onChange={handleDiagnosisCodeChange}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.diagnosisName')}
          value={value.diagnosisName || ''}
          onChange={handleDiagnosisNameChange}
        />
      </Grid>
    </>
  );
};
