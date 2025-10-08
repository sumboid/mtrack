import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/useIsMobile';
import { MedicalRecordForm } from './medical.record.form.component';
import type { CreatePointRecordParams, CreateContinuousRecordParams } from '../fsm/medical.history.machine';
import type { MedicalHistoryRecord } from '../models/medical.history.model';

interface AddMedicalRecordDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSubmit: (data: CreatePointRecordParams | CreateContinuousRecordParams, keepDialogOpen?: boolean) => void;
}

interface EditMedicalRecordDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  record: MedicalHistoryRecord;
  onSubmit: (record: MedicalHistoryRecord) => void;
}

export const AddMedicalRecordDialog: React.FC<AddMedicalRecordDialogProps> = ({
  open,
  onClose,
  patientId,
  patientName,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('patientDetails.addRecord')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <MedicalRecordForm
          mode="add"
          patientId={patientId}
          patientName={patientName}
          onSubmit={onSubmit}
          onCancel={onClose}
          compact
          saveAndAddNext
        />
      </DialogContent>
    </Dialog>
  );
};

export const EditMedicalRecordDialog: React.FC<EditMedicalRecordDialogProps> = ({
  open,
  onClose,
  patientId,
  patientName,
  record,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('common.edit')} {t('patientDetails.medicalHistory')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <MedicalRecordForm
          mode="edit"
          patientId={patientId}
          patientName={patientName}
          record={record}
          onSubmit={onSubmit as any}
          onCancel={onClose}
          compact
        />
      </DialogContent>
    </Dialog>
  );
};
