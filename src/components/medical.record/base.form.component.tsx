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
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../../models/medical.history.model';
import { CategoryDefs } from '../../models/config';

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

export interface BaseMedicalRecordFormProps {
  mode: 'add' | 'edit';
  patientId: string;
  patientName: string;
  record?: MedicalHistoryRecord;
  onSubmit: (data: any, keepDialogOpen?: boolean) => void;
  onCancel: () => void;
  compact?: boolean;
  saveAndAddNext?: boolean;
  category: MedicalRecordCategory;
  onCategoryChange: (category: MedicalRecordCategory) => void;
  children?: React.ReactNode;
}

export const BaseMedicalRecordForm: React.FC<BaseMedicalRecordFormProps> = ({
  mode,
  patientName,
  onSubmit,
  onCancel,
  compact = false,
  saveAndAddNext = false,
  category,
  onCategoryChange,
  children,
}) => {
  const { t } = useTranslation();

  const [date, setDate] = React.useState<Dayjs | null>(() => dayjs());
  const [isContinuous, setIsContinuous] = React.useState(() => 
    CategoryDefs[category].type === 'continuous'
  );
  const [startDate, setStartDate] = React.useState<Dayjs | null>(() => dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(() => null);
  const [isOngoing, setIsOngoing] = React.useState(() => true);
  const [notes, setNotes] = React.useState('');

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
    setIsContinuous(config.type === 'continuous');
    if (config.type === 'continuous') {
      setDate(null);
      setStartDate(dayjs());
    } else {
      setDate(dayjs());
      setStartDate(null);
    }
    onCategoryChange(newCategory);
  }, [onCategoryChange]);

  const handleOngoingChange = React.useCallback((checked: boolean) => {
    setIsOngoing(checked);
    if (checked) {
      setEndDate(null);
    }
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
    
    // Prepare form data
    const formData = {
      date: isContinuous ? (startDate || dayjs()).toDate() : (date || dayjs()).toDate(),
      startDate: isContinuous ? (startDate || dayjs()).toDate() : undefined,
      endDate: isContinuous && !isOngoing && endDate ? endDate.toDate() : undefined,
      notes: notes || undefined,
      isContinuous,
    };
    
    // Call parent's onSubmit
    onSubmit(formData);
    
    // Reset form for "Save and Add Next" mode
    if (mode === 'add' && saveAndAddNext) {
      setDate(dayjs());
      setStartDate(dayjs());
      setEndDate(null);
      setIsOngoing(true);
      setNotes('');
    }
  }, [date, startDate, endDate, notes, isContinuous, isOngoing, onSubmit, mode, saveAndAddNext]);

  const formContent = (
    <Box component="form" id="medical-record-form" onSubmit={handleSubmit} sx={compact ? undefined : formBoxSx}>
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

        {/* Category-Specific Fields (passed as children) */}
        {children}

        {/* Notes Field */}
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
};
