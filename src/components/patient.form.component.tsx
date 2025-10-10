import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Patient, PatientData } from '../models/patient.model';
import { DiagnosisFormFactory, type DiagnosisType } from './diagnoses/diagnosis.factory.component';
import type { BreastCancer } from '../models/diagnoses/breast.cancer';

// Static styles
const cardContentSx = { mb: 3 };
const buttonContainerSx = { display: 'flex', gap: 2, justifyContent: 'flex-end' };
const formContainerSx = { width: '100%', ml: 0 }; // Prevent Grid negative margins from causing overflow

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

  const [name, setName] = React.useState(() => patient?.name || '');
  const [email, setEmail] = React.useState(() => patient?.email || '');
  const [phone, setPhone] = React.useState(() => patient?.phone || '');
  const [dateOfBirth, setDateOfBirth] = React.useState(() => 
    patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : dayjs()
  );
  const [diagnosisType, setDiagnosisType] = React.useState<DiagnosisType>(() => 
    patient?.diagnosis?.diagnosis || 'breast-cancer'
  );
  const [diagnosisDetails, setDiagnosisDetails] = React.useState<BreastCancer['details']>(() => 
    patient?.diagnosis?.diagnosis === 'breast-cancer' 
      ? patient.diagnosis.details 
      : {
          localization: 'left',
          tnmT: 'T1',
          tnmN: 'N0',
          tnmM: 'M0',
          metastaticStatus: 'early',
          tumorType: 'invasive-nst',
          er: '0',
          pr: '0',
          her2: '0',
          grade: 'G2',
        }
  );
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

  const handleDiagnosisTypeChange = React.useCallback((e: { target: { value: unknown } }) => {
    setDiagnosisType(e.target.value as DiagnosisType);
    setDiagnosisDetails({
      localization: 'left',
      tnmT: 'T1',
      tnmN: 'N0',
      tnmM: 'M0',
      metastaticStatus: 'early',
      tumorType: 'invasive-nst',
      er: '0',
      pr: '0',
      her2: '0',
      grade: 'G2',
    });
  }, []);

  const handleDiagnosisDetailsChange = React.useCallback((value: BreastCancer['details']) => {
    setDiagnosisDetails(value);
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

    const diagnosis = diagnosisType === 'breast-cancer' 
      ? { diagnosis: 'breast-cancer' as const, details: diagnosisDetails }
      : { diagnosis: 'breast-cancer' as const, details: diagnosisDetails };

    onSubmit({ 
      name, 
      email, 
      phone, 
      dateOfBirth: dateOfBirth.toDate(), 
      diagnosis, 
      notes 
    });
  }, [name, email, phone, dateOfBirth, diagnosisType, diagnosisDetails, notes, onSubmit, validate]);

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
      <Grid container spacing={gridSpacing} sx={formContainerSx}>
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
          <FormControl fullWidth>
            <InputLabel>{t('patient.form.diagnosisType')}</InputLabel>
            <Select
              value={diagnosisType}
              onChange={handleDiagnosisTypeChange}
              label={t('patient.form.diagnosisType')}
            >
              <MenuItem value="breast-cancer">{t('diagnosis.breastCancer.name')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={fullWidthGridSize}>
          <Divider sx={{ my: 2 }} />
          <DiagnosisFormFactory
            type={diagnosisType}
            value={diagnosisDetails}
            onChange={handleDiagnosisDetailsChange}
            errors={{}}
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
