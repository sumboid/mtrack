import React from 'react';
import { TextField, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ImmunotherapyFields } from '../../models/medical.history.model';

export interface ImmunotherapyFormFieldsProps {
  value: ImmunotherapyFields;
  onChange: (field: string, value: any) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };
const fullWidthGridSize = { xs: 12 };

export const ImmunotherapyFormFields: React.FC<ImmunotherapyFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleAgentChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('agent', e.target.value),
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
          label={t('addRecord.agent')}
          value={value.agent || ''}
          onChange={handleAgentChange}
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
            <MenuItem value="complete">{t('addRecord.responseComplete')}</MenuItem>
            <MenuItem value="partial">{t('addRecord.responsePartial')}</MenuItem>
            <MenuItem value="stable">{t('addRecord.responseStable')}</MenuItem>
            <MenuItem value="progressive">{t('addRecord.responseProgressive')}</MenuItem>
            <MenuItem value="unknown">{t('addRecord.responseUnknown')}</MenuItem>
          </Select>
        </FormControl>
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
