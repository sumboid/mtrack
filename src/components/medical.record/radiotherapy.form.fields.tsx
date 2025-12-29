import React from 'react';
import { useTranslation } from 'react-i18next';
import type { RadiotherapyFields } from '../../models/medical.history.model';
import { Grid, TextField } from '../mui';

export interface RadiotherapyFormFieldsProps {
  value: RadiotherapyFields;
  onChange: (field: string, value: unknown) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };
const fullWidthGridSize = { xs: 12 };

export const RadiotherapyFormFields: React.FC<RadiotherapyFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleTargetAreaChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('targetArea', e.target.value),
    [onChange]
  );

  const handleTotalDoseChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? undefined : Number(e.target.value);
      onChange('totalDose', value);
    },
    [onChange]
  );

  const handleFractionsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? undefined : Number(e.target.value);
      onChange('fractions', value);
    },
    [onChange]
  );

  const handleTechniqueChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('technique', e.target.value),
    [onChange]
  );

  const handleSideEffectsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('sideEffects', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.targetArea')}
          value={value.targetArea || ''}
          onChange={handleTargetAreaChange}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          type="number"
          label={t('medicalRecord.radiotherapy.totalDose')}
          value={value.totalDose ?? ''}
          onChange={handleTotalDoseChange}
          slotProps={{
            htmlInput: { min: 0, step: 0.1 }
          }}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          type="number"
          label={t('medicalRecord.radiotherapy.fractions')}
          value={value.fractions ?? ''}
          onChange={handleFractionsChange}
          slotProps={{
            htmlInput: { min: 0, step: 1 }
          }}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.technique')}
          value={value.technique || ''}
          onChange={handleTechniqueChange}
        />
      </Grid>

      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={2}
          label={t('addRecord.sideEffects')}
          value={value.sideEffects || ''}
          onChange={handleSideEffectsChange}
        />
      </Grid>
    </>
  );
};
