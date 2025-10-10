import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FollowUpFormFieldsProps {
  value: {
    findings?: string;
    plan?: string;
  };
  onChange: (field: string, value: any) => void;
}

const fullWidthGridSize = { xs: 12 };

export const FollowUpFormFields: React.FC<FollowUpFormFieldsProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleFindingsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('findings', e.target.value),
    [onChange]
  );

  const handlePlanChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange('plan', e.target.value),
    [onChange]
  );

  return (
    <>
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

      <Grid size={fullWidthGridSize}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('addRecord.plan')}
          value={value.plan || ''}
          onChange={handlePlanChange}
        />
      </Grid>
    </>
  );
};
