import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Patient, PatientData } from '../models/patient.model';

// Static styles
const cardContentSx = { mb: 3 };
const buttonContainerSx = { display: 'flex', gap: 2, justifyContent: 'flex-end' };

// Static Grid sizes
const fullWidthGridSize = { xs: 12 };
const halfWidthGridSize = { xs: 12, md: 6 };

// Static spacing
const gridSpacing = 3;

interface PatientFormProps {
  mode: 'add' | 'edit';
  patient?: Patient;
  onSubmit: (data: PatientData) => void;
  onCancel: () => void;
  compact?: boolean; // When true, removes Card wrapper and titles for use in dialogs
}

export const PatientForm: React.FC<PatientFormProps> = React.memo(({
  mode,
  patient,
  onSubmit,
  onCancel,
  compact = false,
}) => {
  const { t } = useTranslation();

  // Split state to prevent unnecessary re-renders
  const [name, setName] = React.useState(() => patient?.name || '');
  const [email, setEmail] = React.useState(() => patient?.email || '');
  const [phone, setPhone] = React.useState(() => patient?.phone || '');
  const [dateOfBirth, setDateOfBirth] = React.useState(() => 
    patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : dayjs()
  );
  const [diagnosis, setDiagnosis] = React.useState(() => patient?.diagnosis || '');
  const [notes, setNotes] = React.useState(() => patient?.notes || '');

  const [errors, setErrors] = React.useState<Partial<Record<keyof PatientData, string>>>({});

  const clearError = React.useCallback((field: keyof PatientData) => {
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    clearError('name');
  }, [clearError]);

  const handleEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearError('email');
  }, [clearError]);

  const handlePhoneChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    clearError('phone');
  }, [clearError]);

  const handleDateOfBirthChange = React.useCallback((newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      setDateOfBirth(newValue);
    }
  }, []);

  const handleDiagnosisChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDiagnosis(e.target.value);
  }, []);

  const handleNotesChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  }, []);

  const validate = React.useCallback((): boolean => {
    const newErrors: Partial<Record<keyof PatientData, string>> = {};

    if (!name.trim()) {
      newErrors.name = t('patient.form.nameRequired');
    }

    if (!email.trim()) {
      newErrors.email = t('patient.form.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('patient.form.emailInvalid');
    }

    if (!phone.trim()) {
      newErrors.phone = t('patient.form.phoneRequired');
    } else if (phone.length < 7 || phone.length > 15) {
      newErrors.phone = t('patient.form.phoneInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, phone, t]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({ 
      name, 
      email, 
      phone, 
      dateOfBirth: dateOfBirth.toDate(), 
      diagnosis, 
      notes 
    });
  }, [name, email, phone, dateOfBirth, diagnosis, notes, onSubmit, validate]);

  // Memoize conditional translations
  const titleText = React.useMemo(() => 
    mode === 'add' ? t('patient.form.addTitle') : t('patient.form.editTitle'),
    [mode, t]
  );

  const descriptionText = React.useMemo(() => 
    mode === 'add' ? t('patient.form.addDescription') : t('patient.form.editDescription'),
    [mode, t]
  );

  const formContent = (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={gridSpacing}>
        <Grid size={halfWidthGridSize}>
          <TextField
            fullWidth
            required
            label={t('patient.form.name')}
            value={name}
            onChange={handleNameChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid size={halfWidthGridSize}>
          <TextField
            fullWidth
            required
            type="email"
            label={t('patient.form.email')}
            value={email}
            onChange={handleEmailChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid size={halfWidthGridSize}>
          <TextField
            fullWidth
            required
            label={t('patient.form.phone')}
            value={phone}
            onChange={handlePhoneChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        <Grid size={halfWidthGridSize}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t('patient.form.dateOfBirth')}
              value={dateOfBirth}
              onChange={handleDateOfBirthChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <TextField
            fullWidth
            label={t('patient.form.diagnosis')}
            value={diagnosis}
            onChange={handleDiagnosisChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid size={fullWidthGridSize}>
          <TextField
            fullWidth
            label={t('patient.form.notes')}
            value={notes}
            onChange={handleNotesChange}
            multiline
            rows={3}
          />
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Box sx={buttonContainerSx}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              {t('common.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  if (compact) {
    return formContent;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          {titleText}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={cardContentSx}>
          {descriptionText}
        </Typography>
        {formContent}
      </CardContent>
    </Card>
  );
});
