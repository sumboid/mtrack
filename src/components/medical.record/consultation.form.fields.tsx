import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConsultationFormFieldsProps {
  value: {
    specialist?: string;
    reason?: string;
    recommendations?: string;
  };
  onChange: (field: string, value: any) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };
const fullWidthGridSize = { xs: 12 };

export const ConsultationFormFields: React.FC<ConsultationFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleSpecialistChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('specialist', e.target.value),
    [onChange]
  );

  const handleReasonChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('reason', e.target.value),
    [onChange]
  );

  const handleRecommendationsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('recommendations', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.specialist')}
          value={value.specialist || ''}
          onChange={handleSpecialistChange}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.reason')}
          value={value.reason || ''}
          onChange={handleReasonChange}
        />
      </Grid>

      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('addRecord.recommendations')}
          value={value.recommendations || ''}
          onChange={handleRecommendationsChange}
        />
      </Grid>
    </>
  );
};
