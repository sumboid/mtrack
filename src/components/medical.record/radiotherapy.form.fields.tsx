import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface RadiotherapyFormFieldsProps {
  value: {
    targetArea?: string;
    totalDose?: string;
    fractions?: string;
    technique?: string;
    sideEffects?: string;
  };
  onChange: (field: string, value: any) => void;
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
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('totalDose', e.target.value),
    [onChange]
  );

  const handleFractionsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('fractions', e.target.value),
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
          label={t('addRecord.totalDose')}
          value={value.totalDose || ''}
          onChange={handleTotalDoseChange}
        />
      </Grid>

      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.fractions')}
          value={value.fractions || ''}
          onChange={handleFractionsChange}
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
