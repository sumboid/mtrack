import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DiagnosisFormFieldsProps {
  value: {
    diagnosisCode?: string;
    diagnosisName?: string;
  };
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
