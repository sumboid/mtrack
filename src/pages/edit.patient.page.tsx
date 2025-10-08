import React from 'react';
import {
  Container,
  Button,
  Typography,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActor } from '@xstate/react';
import { patientMachine } from '../fsm/list.machine';
import { PatientForm } from '../components/patient.form.component';
import type { PatientData } from '../models/patient.model';

const EditPatientPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [state, send] = useActor(patientMachine);

  const patient = React.useMemo(() => {
    return state.context.patients.find(p => p.id === patientId);
  }, [state.context.patients, patientId]);

  const handleSubmit = React.useCallback((data: PatientData) => {
    if (!patient) return;

    const updatedPatient = {
      ...patient,
      ...data,
      updatedAt: new Date(),
    };

    send({ type: 'UPDATE_PATIENT', patient: updatedPatient });
    navigate(`/patient/${patientId}`);
  }, [patient, send, navigate, patientId]);

  const handleCancel = React.useCallback(() => {
    navigate(`/patient/${patientId}`);
  }, [navigate, patientId]);

  if (state.matches('loading')) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('patients.loading')}
        </Typography>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          {t('patientDetails.backToPatients')}
        </Button>
        <Typography variant="h4" color="error">
          {t('patientDetails.notFound')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/patient/${patientId}`)}
        sx={{ mb: 3 }}
      >
        {t('patientDetails.backToDetails')}
      </Button>

      <PatientForm
        mode="edit"
        patient={patient}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default EditPatientPage;
