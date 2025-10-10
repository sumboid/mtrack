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
import { PatientForm } from './patient.form.component';
import type { Patient, PatientData } from '../models/patient.model';

interface AddPatientDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PatientData) => void;
}

interface EditPatientDialogProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  onSubmit: (patient: Patient) => void;
}

export const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('patients.addNew')}
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
      <DialogContent dividers sx={{ pt: 3, overflow: 'hidden', overflowY: 'auto' }}>
        <PatientForm
          mode="add"
          onSubmit={onSubmit}
          onCancel={onClose}
          compact
        />
      </DialogContent>
    </Dialog>
  );
};

export const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  open,
  onClose,
  patient,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const handleSubmit = React.useCallback((data: PatientData) => {
    // Merge the data with the existing patient to preserve id and timestamps
    onSubmit({
      ...patient,
      ...data,
    });
  }, [patient, onSubmit]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('patientDetails.editPatient')}
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
      <DialogContent dividers sx={{ pt: 3, overflow: 'hidden', overflowY: 'auto' }}>
        <PatientForm
          mode="edit"
          patient={patient}
          onSubmit={handleSubmit}
          onCancel={onClose}
          compact
        />
      </DialogContent>
    </Dialog>
  );
};
