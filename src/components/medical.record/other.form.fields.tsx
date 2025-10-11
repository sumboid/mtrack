import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { OtherFields } from '../../models/medical.history.model';

export interface OtherFormFieldsProps {
  value: OtherFields;
  onChange: (field: string, value: any) => void;
}

const fullWidthGridSize = { xs: 12 };

export const OtherFormFields: React.FC<OtherFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleDescriptionChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('description', e.target.value),
    [onChange]
  );

  return (
    <>
      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label={t('addRecord.description')}
          value={value.description || ''}
          onChange={handleDescriptionChange}
        />
      </Grid>
    </>
  );
};
