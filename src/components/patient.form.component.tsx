import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  MenuItem,
  Divider,
} from './mui';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMachine, useSelector } from '@xstate/react';
import type { Patient, PatientData } from '../models/patient.model';
import { DiagnosisFormFactory } from './diagnoses/diagnosis.factory.component';
import { TextField, Button, FormControl, InputLabel, Select, Grid } from './mui';
import { createPatientFormMachine } from '../fsm/patient.form.machine';

const cardContentSx = { mb: 3 };
const buttonContainerSx = { display: 'flex', gap: 2, justifyContent: 'flex-end' };
const formContainerSx = { width: '100%', ml: 0 }; // Prevent Grid negative margins from causing overflow

const fullWidthGridSize = { xs: 12 };
const halfWidthGridSize = { xs: 12, md: 6 };

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

  const machine = React.useMemo(() => createPatientFormMachine(), []);
  const [state, send] = useMachine(machine);
  
  // Initialize form when mode or patient changes
  React.useEffect(() => {
    send({ type: 'INITIALIZE', mode, patient });
  }, [mode, patient, send]);
  
  // Type guard to check if ref is valid ActorRef
  const isActorRef = (ref: unknown): boolean => {
    return ref !== null && ref !== undefined && typeof ref === 'object' && 'subscribe' in ref && 'getSnapshot' in ref;
  };
  
  // Always call useSelector (Rules of Hooks), but pass undefined if ref is invalid
  const isValidRef = isActorRef(state.context.diagnosisConfigRef);
  const diagnosisState = useSelector(
    isValidRef ? (state.context.diagnosisConfigRef as Parameters<typeof useSelector>[0]) : undefined,
    (snapshot) => snapshot
  );
  
  // Extract diagnosis type and breast cancer form ref safely
  const getDiagnosisType = (): 'breast-cancer' => {
    if (!diagnosisState || typeof diagnosisState !== 'object' || !('context' in diagnosisState)) {
      return 'breast-cancer';
    }
    const ctx = diagnosisState.context;
    if (ctx && typeof ctx === 'object' && 'type' in ctx && ctx.type === 'breast-cancer') {
      return 'breast-cancer';
    }
    return 'breast-cancer';
  };
  
  const getBreastCancerFormRef = (): unknown => {
    if (!diagnosisState || typeof diagnosisState !== 'object' || !('context' in diagnosisState)) {
      return undefined;
    }
    const ctx = diagnosisState.context;
    if (ctx && typeof ctx === 'object' && 'breastCancerFormRef' in ctx) {
      const ref = (ctx as Record<string, unknown>).breastCancerFormRef;
      return isActorRef(ref) ? ref : undefined;
    }
    return undefined;
  };
  
  const diagnosisType = getDiagnosisType();
  const breastCancerFormRef = getBreastCancerFormRef();

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  }, [send]);

  const handleNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'CHANGE', field: 'name', value: e.target.value });
  }, [send]);

  const handleEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'CHANGE', field: 'email', value: e.target.value });
  }, [send]);

  const handlePhoneChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'CHANGE', field: 'phone', value: e.target.value });
  }, [send]);

  const handleDateOfBirthChange = React.useCallback((newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      send({ type: 'CHANGE', field: 'dateOfBirth', value: newValue });
    }
  }, [send]);

  const handleDiagnosisTypeChange = React.useCallback((e: { target: { value: unknown } }) => {
    const value = String(e.target.value);
    if (value === 'breast-cancer') {
      send({ type: 'CHANGE_DIAGNOSIS_TYPE', value });
    }
  }, [send]);

  const handleNotesChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'CHANGE', field: 'notes', value: e.target.value });
  }, [send]);

  const wasSubmittedRef = React.useRef(false);

  React.useEffect(() => {
    // Reset ref when form is reinitialized (output is cleared)
    if (!state.context.output) {
      wasSubmittedRef.current = false;
    }
  }, [state.context.output]);

  React.useEffect(() => {
    // Check for output in idle state (submitted state transitions too fast to catch)
    if (state.matches('idle') && state.context.output && !wasSubmittedRef.current) {
      wasSubmittedRef.current = true;
      // Blur active element to prevent aria-hidden warning when dialog closes
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      onSubmit(state.context.output);
    }
  }, [state, onSubmit]);

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
            value={state.context.name}
            onChange={handleNameChange}
          />
        </Grid>

        <Grid size={halfWidthGridSize}>
          <TextField
            fullWidth
            required
            type="email"
            label={t('patient.form.email')}
            value={state.context.email}
            onChange={handleEmailChange}
          />
        </Grid>

        <Grid size={halfWidthGridSize}>
          <TextField
            fullWidth
            required
            label={t('patient.form.phone')}
            value={state.context.phone}
            onChange={handlePhoneChange}
          />
        </Grid>

        <Grid size={halfWidthGridSize}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t('patient.form.dateOfBirth')}
              value={state.context.dateOfBirth}
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
            breastCancerFormRef={isActorRef(breastCancerFormRef) ? breastCancerFormRef as Parameters<typeof DiagnosisFormFactory>[0]['breastCancerFormRef'] : undefined}
          />
        </Grid>

        <Grid size={fullWidthGridSize}>
          <TextField
            fullWidth
            label={t('patient.form.notes')}
            value={state.context.notes}
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

PatientForm.displayName = 'PatientForm';
