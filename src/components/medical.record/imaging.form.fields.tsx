import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ImagingFields } from '../../models/medical.history.model';

export interface ImagingFormFieldsProps {
  value: ImagingFields;
  onChange: (field: string, value: any) => void;
}

const halfWidthGridSize = { xs: 12, sm: 6 };
const fullWidthGridSize = { xs: 12 };

export const ImagingFormFields: React.FC<ImagingFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleImagingTypeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('imagingType', e.target.value),
    [onChange]
  );

  const handleFindingsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('findings', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={halfWidthGridSize}>
        <TextField
          fullWidth
          label={t('addRecord.imagingType')}
          value={value.imagingType || ''}
          onChange={handleImagingTypeChange}
        />
      </Grid>

      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('addRecord.findings')}
          value={value.findings || ''}
          onChange={handleFindingsChange}
        />
      </Grid>
    </>
  );
};
