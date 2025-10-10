import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface LabTestFormFieldsProps {
  value: {
    testType?: string;
    results?: string;
  };
  onChange: (field: string, value: any) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };
const fullWidthGridSize = { xs: 12 };

export const LabTestFormFields: React.FC<LabTestFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleTestTypeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('testType', e.target.value),
    [onChange]
  );

  const handleResultsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('results', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.testType')}
          value={value.testType || ''}
          onChange={handleTestTypeChange}
        />
      </Grid>

      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('addRecord.results')}
          value={value.results || ''}
          onChange={handleResultsChange}
        />
      </Grid>
    </>
  );
};
