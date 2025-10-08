import React from 'react';
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

export const PatientsCardList: React.FC<PatientsCardListProps> = ({
  patients,
  onPatientClick,
  formatDate,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      {patients.map((patient: Patient) => (
        <Card key={patient.id} sx={cardSx} elevation={1}>
          <CardActionArea onClick={() => onPatientClick(patient.id)}>
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
      ))}
    </Box>
  );
};
