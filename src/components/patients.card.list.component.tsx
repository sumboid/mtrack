import React, { useCallback } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Patient } from '../models/patient.model';

interface PatientsCardListProps {
  patients: Patient[];
  onPatientClick: (patientId: string) => void;
  formatDate: (date: Date | string) => string;
}

const cardSx = { mb: 2 } as const;
const headerBoxSx = { display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 } as const;
const infoRowSx = { display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' } as const;
const iconSx = { fontSize: 18 } as const;

// Memoized card component to prevent re-renders when other cards change
const PatientCard: React.FC<{
  patient: Patient;
  onPatientClick: (patientId: string) => void;
  formatDate: (date: Date | string) => string;
}> = React.memo(({ patient, onPatientClick, formatDate }) => {
  const { t } = useTranslation();
  
  const handleClick = useCallback(() => {
    onPatientClick(patient.id);
  }, [onPatientClick, patient.id]);

  return (
    <Card sx={cardSx} elevation={1}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Box sx={headerBoxSx}>
            <PersonIcon color="primary" />
            <Typography variant="h6" component="div">
              {patient.name}
            </Typography>
          </Box>
          
          <Stack spacing={1}>
            <Box sx={infoRowSx}>
              <EmailIcon sx={iconSx} />
              <Typography variant="body2">{patient.email}</Typography>
            </Box>
            
            <Box sx={infoRowSx}>
              <PhoneIcon sx={iconSx} />
              <Typography variant="body2">{patient.phone}</Typography>
            </Box>
            
            <Box sx={infoRowSx}>
              <CalendarIcon sx={iconSx} />
              <Typography variant="body2">
                {t('patients.born')} {formatDate(patient.dateOfBirth)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

PatientCard.displayName = 'PatientCard';

export const PatientsCardList: React.FC<PatientsCardListProps> = React.memo(({
  patients,
  onPatientClick,
  formatDate,
}) => {
  return (
    <Box>
      {patients.map((patient: Patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onPatientClick={onPatientClick}
          formatDate={formatDate}
        />
      ))}
    </Box>
  );
});

PatientsCardList.displayName = 'PatientsCardList';
