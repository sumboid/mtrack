import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const halfWidthGridSize = { xs: 12, md: 6 };

export interface ChemotherapyFormFieldsProps {
  value: {
    regimen?: string;
    cycles?: number;
    response?: string;
    sideEffects?: string;
  };
  onChange: (field: string, value: any) => void;
}

export const ChemotherapyFormFields: React.FC<ChemotherapyFormFieldsProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const handleRegimenChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('regimen', e.target.value),
    [onChange]
  );

  const handleCyclesChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('cycles', parseInt(e.target.value) || ''),
    [onChange]
  );

  const handleResponseChange = React.useCallback(
    (e: any) => onChange('response', e.target.value),
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
          label={t('addRecord.regimen')}
          value={value.regimen || ''}
          onChange={handleRegimenChange}
        />
      </Grid>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          type="number"
          label={t('addRecord.cycles')}
          value={value.cycles || ''}
          onChange={handleCyclesChange}
        />
      </Grid>
      <Grid size={halfWidthGridSize}>
        <FormControl fullWidth>
          <InputLabel>{t('addRecord.response')}</InputLabel>
          <Select
            value={value.response || ''}
            label={t('addRecord.response')}
            onChange={handleResponseChange}
          >
            <MenuItem value="complete-response">{t('addRecord.completeResponse')}</MenuItem>
            <MenuItem value="partial-response">{t('addRecord.partialResponse')}</MenuItem>
            <MenuItem value="stable-disease">{t('addRecord.stableDisease')}</MenuItem>
            <MenuItem value="progressive-disease">{t('addRecord.progressiveDisease')}</MenuItem>
            <MenuItem value="not-assessed">{t('addRecord.notAssessed')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.sideEffects')}
          value={value.sideEffects || ''}
          onChange={handleSideEffectsChange}
        />
      </Grid>
    </>
  );
};
