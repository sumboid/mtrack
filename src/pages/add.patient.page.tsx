import React from 'react';
import {
  Container,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActor } from '@xstate/react';
import { patientMachine } from '../fsm/list.machine';
import { PatientForm } from '../components/patient.form.component';
import { createPatient } from '../models/patient.model';
import type { PatientData } from '../models/patient.model';

const AddPatientPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, send] = useActor(patientMachine);

  const handleSubmit = React.useCallback((data: PatientData) => {
    const patient = createPatient(data);
    send({ type: 'ADD_PATIENT', patient });
    navigate('/');
  }, [send, navigate]);

  const handleCancel = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleCancel}
        sx={{ mb: 3 }}
      >
        {t('patientDetails.backToPatients')}
      </Button>

      <PatientForm
        mode="add"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default AddPatientPage;
