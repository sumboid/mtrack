import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormControlLabel,
  Switch,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import { CategoryDefs } from '../models/config';
import type { CreatePointRecordParams, CreateContinuousRecordParams } from '../fsm/medical.history.machine';

const formBoxSx = { mt: 3 };
const paperSx = { p: 3 };
const buttonContainerSx = { display: 'flex', gap: 2, justifyContent: 'flex-end' };

const requiredFullWidthTextFieldProps = {
  textField: {
    required: true,
    fullWidth: true,
  },
};

const fullWidthGridSize = { xs: 12 };
const halfWidthGridSize = { xs: 12, md: 6 };

const responsiveStackDirection = { xs: 'column' as const, md: 'row' as const };

const stackSpacing25 = 2.5;
const stackSpacing2 = 2;
const gridSpacing = 3;

const categoryEntries = Object.entries(CategoryDefs);

interface MedicalRecordFormProps {
  mode: 'add' | 'edit';
  patientId: string;
  patientName: string;
  record?: MedicalHistoryRecord;
  onSubmit: (data: CreatePointRecordParams | CreateContinuousRecordParams | MedicalHistoryRecord, keepDialogOpen?: boolean) => void;
  onCancel: () => void;
  compact?: boolean; // When true, removes Card wrapper and titles for use in dialogs
  saveAndAddNext?: boolean; // When true, keeps form open and resets after save (add mode only)
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = React.memo(({
  mode,
  patientId,
  patientName,
  record,
  onSubmit,
  onCancel,
  compact = false,
  saveAndAddNext = false,
}) => {
  const { t } = useTranslation();

  // Split state to prevent unnecessary re-renders
  const [category, setCategory] = React.useState<MedicalRecordCategory>(() => 
    record?.category || 'consultation'
  );
  const [date, setDate] = React.useState<Dayjs | null>(() => 
    record?.date ? dayjs(record.date) : dayjs()
  );
  const [treatment, setTreatment] = React.useState(() => 
    record?.treatment || ''
  );
  const [notes, setNotes] = React.useState(() => 
    record?.notes || ''
  );
  const [isContinuous, setIsContinuous] = React.useState(() => 
    record?.startDate !== undefined && record?.startDate !== null
  );
  const [startDate, setStartDate] = React.useState<Dayjs | null>(() => 
    record?.startDate ? dayjs(record.startDate) : dayjs()
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(() => 
    record?.endDate ? dayjs(record.endDate) : null
  );
  const [isOngoing, setIsOngoing] = React.useState(() => 
    record?.endDate === null && record?.startDate !== null
  );

  // Memoize conditional translations
  const titleText = React.useMemo(() => 
    mode === 'add' ? t('addRecord.title') : t('editRecord.title'),
    [mode, t]
  );

  const forPatientText = React.useMemo(() => 
    mode === 'add' ? t('addRecord.forPatient') : t('editRecord.forPatient'),
    [mode, t]
  );

  const handleCategoryChange = React.useCallback((newCategory: MedicalRecordCategory) => {
    const config = CategoryDefs[newCategory];
    setCategory(newCategory);
    setIsContinuous(config.type === 'continuous');
    // Reset date fields based on type
    if (config.type === 'continuous') {
      setDate(null);
      setStartDate(dayjs());
    } else {
      setDate(dayjs());
      setStartDate(null);
    }
  }, []);

  const handleOngoingChange = React.useCallback((checked: boolean) => {
    setIsOngoing(checked);
    if (checked) {
      setEndDate(null);
    }
  }, []);

  const handleTreatmentChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTreatment(e.target.value);
  }, []);

  const handleNotesChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  }, []);

  const endDateSlotProps = React.useMemo(() => ({
    textField: {
      fullWidth: true,
      helperText: isOngoing ? t('addRecord.ongoingHelp') : undefined,
    },
  }), [isOngoing, t]);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'edit' && record) {
      const updatedRecord: MedicalHistoryRecord = {
        ...record,
        category,
        date: isContinuous ? (startDate || dayjs()).toDate() : (date || dayjs()).toDate(),
        treatment: treatment || undefined,
        notes: notes || undefined,
        startDate: isContinuous ? (startDate || dayjs()).toDate() : undefined,
        endDate: isContinuous && !isOngoing && endDate 
          ? endDate.toDate() 
          : undefined,
        updatedAt: new Date(),
      };
      onSubmit(updatedRecord, false);
    } else {
      const recordData = isContinuous ? {
        patientId,
        category,
        date: (startDate || dayjs()).toDate(),
        startDate: (startDate || dayjs()).toDate(),
        endDate: isOngoing ? undefined : (endDate?.toDate() || undefined),
        treatment: treatment || undefined,
        notes: notes || undefined,
      } : {
        patientId,
        category,
        date: (date || dayjs()).toDate(),
        treatment: treatment || undefined,
        notes: notes || undefined,
      };
      
      // Pass keepDialogOpen=true when saveAndAddNext is enabled
      onSubmit(recordData, saveAndAddNext);
      
      // Reset form for "Save and Add Next" mode
      if (saveAndAddNext) {
        setDate(dayjs());
        setStartDate(dayjs());
        setEndDate(null);
        setTreatment('');
        setNotes('');
        setIsOngoing(true);
      }
    }
  }, [mode, record, category, isContinuous, startDate, date, treatment, notes, isOngoing, endDate, onSubmit, patientId, saveAndAddNext]);

  const formContent = (
    <Box component="form" onSubmit={handleSubmit} sx={compact ? undefined : formBoxSx}>
      <Grid container spacing={gridSpacing}>
        <Grid size={fullWidthGridSize}>
          <FormControl fullWidth required>
            <InputLabel>{t('addRecord.category')}</InputLabel>
            <Select
              value={category}
                    label={t('addRecord.category')}
                    onChange={(e) => handleCategoryChange(e.target.value as MedicalRecordCategory)}
                  >
                    {categoryEntries.map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {t(value.translationKey)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date/Time Range Section */}
              {isContinuous ? (
                <Grid size={fullWidthGridSize}>
                  <Paper variant="outlined" sx={paperSx}>
                    <Stack spacing={stackSpacing25}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {t('addRecord.timeRange')}
                      </Typography>
                      <Divider />
                      <Stack direction={responsiveStackDirection} spacing={stackSpacing2}>
                        <DatePicker
                          label={t('addRecord.startDate')}
                          value={startDate}
                          onChange={setStartDate}
                          slotProps={requiredFullWidthTextFieldProps}
                        />
                        <DatePicker
                          label={t('addRecord.endDate')}
                          value={endDate}
                          onChange={setEndDate}
                          disabled={isOngoing}
                          minDate={startDate || undefined}
                          slotProps={endDateSlotProps}
                        />
                      </Stack>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isOngoing}
                            onChange={(e) => handleOngoingChange(e.target.checked)}
                            color="success"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {t('addRecord.ongoing')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t('addRecord.ongoingDescription')}
                            </Typography>
                          </Box>
                        }
                      />
                    </Stack>
                  </Paper>
                </Grid>
              ) : (
                <Grid size={halfWidthGridSize}>
                  <DatePicker
                    label={t('addRecord.date')}
                    value={date}
                    onChange={setDate}
                    slotProps={requiredFullWidthTextFieldProps}
                  />
                </Grid>
              )}

              {CategoryDefs[category].fields.treatment && (
                <Grid size={fullWidthGridSize}>
                  <TextField
                    fullWidth
                    label={t('addRecord.treatment')}
                    value={treatment}
                    onChange={handleTreatmentChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              )}

              {CategoryDefs[category].fields.notes && (
                <Grid size={fullWidthGridSize}>
                  <TextField
                    fullWidth
                    label={t('addRecord.notes')}
                    value={notes}
                    onChange={handleNotesChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              )}

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
                    {mode === 'add' && saveAndAddNext 
                      ? t('common.saveAndAddNext') 
                      : t('common.save')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
  );

  if (compact) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {formContent}
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {titleText}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {forPatientText}: {patientName}
          </Typography>
          {formContent}
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
});