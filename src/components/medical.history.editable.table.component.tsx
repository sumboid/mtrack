import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Box,
  Button,
  Tooltip,
  Alert,
  FormHelperText,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import { MedicalRecordCategorySchema, CategoryDefs } from '../models/config';

interface EditableRow {
  id: string;
  patientId: string;
  category: MedicalRecordCategory;
  date: Dayjs | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  treatment: string;
  notes: string;
  isNew?: boolean;
  isEditing?: boolean;
  errors?: {
    category?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  };
}

interface MedicalHistoryEditableTableProps {
  records: MedicalHistoryRecord[];
  patientId: string;
  onAddRecord: (record: Omit<MedicalHistoryRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRecord: (record: MedicalHistoryRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

const categories = MedicalRecordCategorySchema.options;

const tableCellSx = { p: 1, verticalAlign: 'top' } as const;
const smallTextFieldSx = { width: '100%' } as const;
const errorCellSx = { borderLeft: '3px solid', borderLeftColor: 'error.main' } as const;

export const MedicalHistoryEditableTable: React.FC<MedicalHistoryEditableTableProps> = ({
  records,
  patientId,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
}) => {
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<EditableRow[]>([]);
  const [newRow, setNewRow] = React.useState<EditableRow | null>(null);

  // Convert records to editable rows
  React.useEffect(() => {
    const editableRows: EditableRow[] = records.map(record => ({
      id: record.id,
      patientId: record.patientId,
      category: record.category,
      date: dayjs(record.date),
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      treatment: record.treatment || '',
      notes: record.notes || '',
      isEditing: false,
      errors: {},
    }));
    setRows(editableRows);
  }, [records]);

  const validateRow = React.useCallback((row: EditableRow): { isValid: boolean; errors: EditableRow['errors'] } => {
    const errors: EditableRow['errors'] = {};
    
    // Validate category
    const categoryResult = MedicalRecordCategorySchema.safeParse(row.category);
    if (!categoryResult.success) {
      errors.category = t('validation.invalidCategory');
    }

    // Validate date
    if (!row.date) {
      errors.date = t('validation.required');
    }

    // Validate startDate for continuous events
    const config = CategoryDefs[row.category];
    if (config?.type === 'continuous' && !row.startDate) {
      errors.startDate = t('validation.requiredForContinuous');
    }

    // Validate endDate is after startDate
    if (row.startDate && row.endDate && row.endDate < row.startDate) {
      errors.endDate = t('validation.endDateBeforeStart');
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [t]);

  const handleAddNewRow = React.useCallback(() => {
    const newRowData: EditableRow = {
      id: 'new-' + Date.now(),
      patientId,
      category: 'diagnosis',
      date: dayjs(),
      startDate: null,
      endDate: null,
      treatment: '',
      notes: '',
      isNew: true,
      isEditing: true,
      errors: {},
    };
    setNewRow(newRowData);
  }, [patientId]);

  const handleCancelNew = React.useCallback(() => {
    setNewRow(null);
  }, []);

  const handleSaveNew = React.useCallback(() => {
    if (!newRow) return;

    const validation = validateRow(newRow);
    if (!validation.isValid) {
      setNewRow({ ...newRow, errors: validation.errors });
      return;
    }

    onAddRecord({
      patientId: newRow.patientId,
      category: newRow.category,
      date: newRow.date!.toDate(),
      startDate: newRow.startDate?.toDate(),
      endDate: newRow.endDate?.toDate(),
      treatment: newRow.treatment || undefined,
      notes: newRow.notes || undefined,
    });
    setNewRow(null);
  }, [newRow, validateRow, onAddRecord]);

  const handleEdit = React.useCallback((rowId: string) => {
    setRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, isEditing: true } : row
    ));
  }, []);

  const handleCancelEdit = React.useCallback((rowId: string) => {
    // Restore original data
    const original = records.find(r => r.id === rowId);
    if (!original) return;

    setRows(prev => prev.map(row => 
      row.id === rowId ? {
        ...row,
        category: original.category,
        date: dayjs(original.date),
        startDate: original.startDate ? dayjs(original.startDate) : null,
        endDate: original.endDate ? dayjs(original.endDate) : null,
        treatment: original.treatment || '',
        notes: original.notes || '',
        isEditing: false,
        errors: {},
      } : row
    ));
  }, [records]);

  const handleSaveEdit = React.useCallback((rowId: string) => {
    const row = rows.find(r => r.id === rowId);
    if (!row) return;

    const validation = validateRow(row);
    if (!validation.isValid) {
      setRows(prev => prev.map(r => 
        r.id === rowId ? { ...r, errors: validation.errors } : r
      ));
      return;
    }

    const original = records.find(r => r.id === rowId);
    if (!original) return;

    onUpdateRecord({
      ...original,
      category: row.category,
      date: row.date!.toDate(),
      startDate: row.startDate?.toDate(),
      endDate: row.endDate?.toDate(),
      treatment: row.treatment || undefined,
      notes: row.notes || undefined,
    });

    setRows(prev => prev.map(r => 
      r.id === rowId ? { ...r, isEditing: false, errors: {} } : r
    ));
  }, [rows, records, validateRow, onUpdateRecord]);

  const handleDelete = React.useCallback((rowId: string) => {
    if (confirm(t('patientDetails.confirmDelete'))) {
      onDeleteRecord(rowId);
    }
  }, [onDeleteRecord, t]);

  const updateRowField = React.useCallback((
    rowId: string,
    field: keyof EditableRow,
    value: any
  ) => {
    setRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  }, []);

  const updateNewRowField = React.useCallback((
    field: keyof EditableRow,
    value: any
  ) => {
    if (!newRow) return;
    setNewRow({ ...newRow, [field]: value });
  }, [newRow]);

  const renderEditableRow = React.useCallback((row: EditableRow, isNew: boolean = false) => {
    const config = CategoryDefs[row.category];
    const isContinuous = config?.type === 'continuous';
    const hasErrors = row.errors && Object.keys(row.errors).length > 0;

    const updateField = isNew ? updateNewRowField : (field: keyof EditableRow, value: any) => 
      updateRowField(row.id, field, value);

    return (
      <TableRow key={row.id} sx={hasErrors ? { bgcolor: 'error.lighter' } : undefined}>
        {/* Category */}
        <TableCell sx={{ ...tableCellSx, ...(row.errors?.category ? errorCellSx : {}) }}>
          <FormControl fullWidth size="small" error={!!row.errors?.category}>
            <Select
              value={row.category}
              onChange={(e) => updateField('category', e.target.value as MedicalRecordCategory)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {t(`categories.${cat}` as any)}
                </MenuItem>
              ))}
            </Select>
            {row.errors?.category && (
              <FormHelperText>{row.errors.category}</FormHelperText>
            )}
          </FormControl>
        </TableCell>

        {/* Date */}
        <TableCell sx={{ ...tableCellSx, ...(row.errors?.date ? errorCellSx : {}) }}>
          <DatePicker
            value={row.date}
            onChange={(date) => updateField('date', date)}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                error: !!row.errors?.date,
                helperText: row.errors?.date,
              },
            }}
          />
        </TableCell>

        {/* Start Date */}
        <TableCell sx={{ ...tableCellSx, ...(row.errors?.startDate ? errorCellSx : {}) }}>
          {isContinuous ? (
            <DatePicker
              value={row.startDate}
              onChange={(date) => updateField('startDate', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  error: !!row.errors?.startDate,
                  helperText: row.errors?.startDate,
                },
              }}
            />
          ) : (
            <Box sx={{ color: 'text.disabled', fontSize: '0.875rem', textAlign: 'center' }}>—</Box>
          )}
        </TableCell>

        {/* End Date */}
        <TableCell sx={{ ...tableCellSx, ...(row.errors?.endDate ? errorCellSx : {}) }}>
          {isContinuous ? (
            <DatePicker
              value={row.endDate}
              onChange={(date) => updateField('endDate', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  error: !!row.errors?.endDate,
                  helperText: row.errors?.endDate,
                },
              }}
            />
          ) : (
            <Box sx={{ color: 'text.disabled', fontSize: '0.875rem', textAlign: 'center' }}>—</Box>
          )}
        </TableCell>

        {/* Treatment */}
        <TableCell sx={tableCellSx}>
          {config?.fields.treatment ? (
            <TextField
              value={row.treatment}
              onChange={(e) => updateField('treatment', e.target.value)}
              size="small"
              multiline
              rows={1}
              sx={smallTextFieldSx}
            />
          ) : (
            <Box sx={{ color: 'text.disabled', fontSize: '0.875rem', textAlign: 'center' }}>—</Box>
          )}
        </TableCell>

        {/* Notes */}
        <TableCell sx={tableCellSx}>
          <TextField
            value={row.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            size="small"
            multiline
            rows={1}
            sx={smallTextFieldSx}
          />
        </TableCell>

        {/* Actions */}
        <TableCell sx={tableCellSx}>
          <Box display="flex" gap={0.5}>
            {hasErrors && (
              <Tooltip title={Object.values(row.errors || {}).join(', ')}>
                <WarningIcon color="error" fontSize="small" />
              </Tooltip>
            )}
            <Tooltip title={t('common.save')}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => isNew ? handleSaveNew() : handleSaveEdit(row.id)}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.cancel')}>
              <IconButton
                size="small"
                onClick={() => isNew ? handleCancelNew() : handleCancelEdit(row.id)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    );
  }, [t, updateRowField, updateNewRowField, handleSaveNew, handleSaveEdit, handleCancelNew, handleCancelEdit]);

  const renderReadOnlyRow = React.useCallback((row: EditableRow) => {
    const config = CategoryDefs[row.category];
    const isContinuous = config?.type === 'continuous';

    return (
      <TableRow key={row.id}>
        <TableCell sx={tableCellSx}>
          {t(`categories.${row.category}` as any)}
        </TableCell>
        <TableCell sx={tableCellSx}>
          {row.date ? row.date.format('L') : '—'}
        </TableCell>
        <TableCell sx={tableCellSx}>
          {isContinuous && row.startDate ? row.startDate.format('L') : '—'}
        </TableCell>
        <TableCell sx={tableCellSx}>
          {isContinuous && row.endDate ? row.endDate.format('L') : '—'}
        </TableCell>
        <TableCell sx={tableCellSx}>
          {config?.fields.treatment && row.treatment ? row.treatment : '—'}
        </TableCell>
        <TableCell sx={tableCellSx}>
          {row.notes || '—'}
        </TableCell>
        <TableCell sx={tableCellSx}>
          <Box display="flex" gap={0.5}>
            <Tooltip title={t('common.edit')}>
              <IconButton
                size="small"
                onClick={() => handleEdit(row.id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('common.delete')}>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(row.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    );
  }, [t, handleEdit, handleDelete]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Alert severity="info" sx={{ flex: 1, mr: 2 }}>
            {t('medicalHistory.editableTableInfo')}
          </Alert>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNewRow}
            disabled={!!newRow}
          >
            {t('common.addRow')}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={tableCellSx}>{t('medicalHistory.category')}</TableCell>
                <TableCell sx={tableCellSx}>{t('medicalHistory.date')}</TableCell>
                <TableCell sx={tableCellSx}>{t('medicalHistory.startDate')}</TableCell>
                <TableCell sx={tableCellSx}>{t('medicalHistory.endDate')}</TableCell>
                <TableCell sx={tableCellSx}>{t('medicalHistory.treatment')}</TableCell>
                <TableCell sx={tableCellSx}>{t('medicalHistory.notes')}</TableCell>
                <TableCell sx={tableCellSx}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newRow && renderEditableRow(newRow, true)}
              {rows.map(row => 
                row.isEditing ? renderEditableRow(row) : renderReadOnlyRow(row)
              )}
              {rows.length === 0 && !newRow && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ color: 'text.secondary' }}>
                      {t('patientDetails.noMedicalRecords')}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};
