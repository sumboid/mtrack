import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SurgeryFields } from '../../models/medical.history.model';

const halfWidthGridSize = { xs: 12, md: 6 };
const fullWidthGridSize = { xs: 12 };

export interface SurgeryFormFieldsProps {
  value: SurgeryFields;
  onChange: (field: string, value: any) => void;
}

export const SurgeryFormFields: React.FC<SurgeryFormFieldsProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const handleSurgeryTypeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('surgeryType', e.target.value),
    [onChange]
  );

  const handleLocationChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('location', e.target.value),
    [onChange]
  );

  const handleSurgeonChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('surgeon', e.target.value),
    [onChange]
  );

  const handleOutcomeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('outcome', e.target.value),
    [onChange]
  );

  const handleComplicationsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('complications', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.surgeryType')}
          value={value.surgeryType || ''}
          onChange={handleSurgeryTypeChange}
        />
      </Grid>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.location')}
          value={value.location || ''}
          onChange={handleLocationChange}
        />
      </Grid>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.surgeon')}
          value={value.surgeon || ''}
          onChange={handleSurgeonChange}
        />
      </Grid>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.outcome')}
          value={value.outcome || ''}
          onChange={handleOutcomeChange}
        />
      </Grid>
      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.complications')}
          value={value.complications || ''}
          onChange={handleComplicationsChange}
          multiline
          rows={2}
        />
      </Grid>
    </>
  );
};
