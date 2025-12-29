import React from 'react';
import {
  Container,
  Button,
} from '../components/mui';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatientsActor } from '../contexts/app.actor.context';
import { PatientForm } from '../components/patient.form.component';
import { createPatient } from '../models/patient.model';
import type { PatientData } from '../models/patient.model';

const AddPatientPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const patientActor = usePatientsActor();

  const handleSubmit = React.useCallback((data: PatientData) => {
    const patient = createPatient(data);
    patientActor.send({ type: 'ADD_PATIENT', patient });
    navigate('/');
  }, [navigate]);

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
