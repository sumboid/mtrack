import React from 'react';
import {
  ListItem,
  Box,
  Chip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';

interface MedicalRecordListItemProps {
  record: MedicalHistoryRecord;
  getCategoryName: (category: MedicalRecordCategory) => string;
  getCategoryColor: (category: MedicalRecordCategory) => string;
  formatDate: (date: Date | string) => string;
  formatDateTime: (date: Date) => string;
  renderRecordDetails: (record: MedicalHistoryRecord) => React.ReactNode;
  onEdit: (record: MedicalHistoryRecord) => void;
  onDelete: (record: MedicalHistoryRecord) => void;
}

const listItemSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  mb: 2,
  p: 2,
  display: 'flex',
  alignItems: 'flex-start',
  '&:hover': {
    bgcolor: 'action.hover',
  },
};
const recordContentBoxSx = { flex: 1, pr: 2 };
const recordHeaderSx = { mb: 1 };
const dateRangeSx = { mb: 0.5 };
const menuIconSx = { mr: 1 };
const headerGap = 1;

export const MedicalRecordListItem: React.FC<MedicalRecordListItemProps> = React.memo(({
  record,
  getCategoryName,
  getCategoryColor,
  formatDate,
  formatDateTime,
  renderRecordDetails,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEdit = React.useCallback(() => {
    handleMenuClose();
    onEdit(record);
  }, [record, onEdit, handleMenuClose]);

  const handleDelete = React.useCallback(() => {
    handleMenuClose();
    onDelete(record);
  }, [record, onDelete, handleMenuClose]);

  return (
    <>
      <ListItem sx={listItemSx}>
        <Box sx={recordContentBoxSx}>
          <Box display="flex" alignItems="center" gap={headerGap} sx={recordHeaderSx}>
            <Chip
              label={getCategoryName(record.category)}
              size="small"
              sx={{
                bgcolor: `${getCategoryColor(record.category)}.main`,
                color: 'white',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(record.date)}
            </Typography>
          </Box>
          
          {renderRecordDetails(record)}
          
          {record.startDate && record.type === 'continuous' && (
            <Typography variant="body2" color="text.secondary" sx={dateRangeSx}>
              <strong>{t('patientDetails.startDate')}:</strong> {formatDate(record.startDate)}
              {record.endDate && (
                <> → <strong>{t('patientDetails.endDate')}:</strong> {formatDate(record.endDate)}</>
              )}
            </Typography>
          )}
          
          {record.notes && (
            <Typography variant="body2" color="text.secondary">
              <strong>{t('patientDetails.notes')}:</strong> {record.notes}
            </Typography>
          )}
        </Box>
        
        <IconButton 
          edge="end" 
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={menuIconSx} fontSize="small" />
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={menuIconSx} fontSize="small" />
          {t('common.delete')}
        </MenuItem>
      </Menu>
    </>
  );
});

MedicalRecordListItem.displayName = 'MedicalRecordListItem';
