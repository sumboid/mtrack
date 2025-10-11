import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { HospitalizationFields } from '../../models/medical.history.model';

export interface HospitalizationFormFieldsProps {
  value: HospitalizationFields;
  onChange: (field: string, value: any) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };
const fullWidthGridSize = { xs: 12 };

export const HospitalizationFormFields: React.FC<HospitalizationFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleReasonChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('reason', e.target.value),
    [onChange]
  );

  const handleDepartmentChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('department', e.target.value),
    [onChange]
  );

  const handleOutcomeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('outcome', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.reason')}
          value={value.reason || ''}
          onChange={handleReasonChange}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.department')}
          value={value.department || ''}
          onChange={handleDepartmentChange}
        />
      </Grid>

      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label={t('addRecord.outcome')}
          value={value.outcome || ''}
          onChange={handleOutcomeChange}
        />
      </Grid>
    </>
  );
};
