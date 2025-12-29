import React from 'react';
import { InputAdornment } from '@mui/material';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '../components/mui';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useSelector } from '@xstate/react';
import { usePatientsActor } from '../contexts/app.actor.context';
import type { Patient, PatientData } from '../models/patient.model';
import { createPatient } from '../models/patient.model';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/useIsMobile';
import { AddPatientDialog } from '../components/patient.dialog.component';
import { PatientsCardList } from '../components/patients.card.list.component';

const containerSx = { mt: 4, mb: 4 } as const;
const headerBoxSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 4,
} as const;
const searchBoxSx = { mb: 3 } as const;
const searchFieldSx = { maxWidth: 400 } as const;
const tableSx = { minWidth: 650 } as const;
const tableRowSx = {
  cursor: 'pointer',
  '&:last-child td, &:last-child th': { border: 0 },
} as const;
const cellContentBoxSx = { display: 'flex', alignItems: 'center' } as const;
const personIconSx = { mr: 1, color: 'primary.main' } as const;
const contactIconSx = { mr: 1, fontSize: 18, color: 'text.secondary' } as const;
const emptyStateBoxSx = { textAlign: 'center', mt: 4 } as const;
const addButtonSx = { mt: 2 } as const;
const retryButtonSx = { mt: 2 } as const;
const searchEmptyDescriptionSx = { mt: 1 } as const;

const searchInputStartAdornment = (
  <InputAdornment position="start">
    <SearchIcon color="primary" />
  </InputAdornment>
);

const searchInputProps = {
  startAdornment: searchInputStartAdornment,
} as const;

const PatientsListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Get patient actor from root machine
  const patientActor = usePatientsActor();

  // Optimize selectors - only subscribe to what we need
  const patients = useSelector(patientActor, (state) => state.context.patients);
  const error = useSelector(patientActor, (state) => state.context.error);
  const searchQuery = useSelector(patientActor, (state) => state.context.searchQuery);
  const addDialogOpen = useSelector(patientActor, (state) => state.context.addDialogOpen);
  const isLoading = useSelector(patientActor, (state) => state.matches('loading'));
  const isFailure = useSelector(patientActor, (state) => state.matches('failure'));
  const isMobile = useIsMobile();

  const handlePatientClick = React.useCallback(
    (patientId: string) => {
      navigate(`/patient/${patientId}`);
    },
    [navigate]
  );

  const handlePatientRowClick = React.useCallback(
    (event: React.MouseEvent<HTMLTableRowElement>) => {
      const patientId = event.currentTarget.dataset.patientId;
      if (patientId) {
        handlePatientClick(patientId);
      }
    },
    [handlePatientClick]
  );

  const handleViewDetailsClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const patientId = event.currentTarget.dataset.patientId;
      if (patientId) {
        handlePatientClick(patientId);
      }
    },
    [handlePatientClick]
  );

  const handleOpenAddDialog = React.useCallback(() => {
    patientActor.send({ type: 'OPEN_ADD_DIALOG' });
  }, []);

  const handleCloseAddDialog = React.useCallback(() => {
    patientActor.send({ type: 'CLOSE_ADD_DIALOG' });
  }, []);

  const handleAddPatient = React.useCallback(
    (data: PatientData) => {
      const patient = createPatient(data);
      patientActor.send({ type: 'ADD_PATIENT', patient });
    },
    []
  );

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      patientActor.send({ type: 'SEARCH_PATIENTS', query });
    },
    []
  );

  const handleRetry = React.useCallback(() => {
    patientActor.send({ type: 'RETRY' });
  }, []);

  const formatDate = React.useCallback((date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={containerSx}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('patients.loading')}
        </Typography>
      </Container>
    );
  }

  if (isFailure) {
    return (
      <Container maxWidth="lg" sx={containerSx}>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          {t('patients.error')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={retryButtonSx}
        >
          {t('patients.retry')}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={containerSx}>
      <Box sx={headerBoxSx}>
        <Typography variant="h4" component="h1">
          {t('patients.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          {t('patients.addNew')}
        </Button>
      </Box>

      <Box sx={searchBoxSx}>
        <TextField
          fullWidth
          placeholder={t('patients.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearch}
          InputProps={searchInputProps}
          sx={searchFieldSx}
        />
      </Box>

      {isMobile ? (
        <PatientsCardList
          patients={patients}
          onPatientClick={handlePatientClick}
          formatDate={formatDate}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={tableSx} aria-label="patients table">
            <TableHead>
              <TableRow>
                <TableCell>{t('patients.table.name')}</TableCell>
                <TableCell>{t('patients.table.email')}</TableCell>
                <TableCell>{t('patients.table.phone')}</TableCell>
                <TableCell>{t('patients.table.dateOfBirth')}</TableCell>
                <TableCell align="center">{t('patients.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient: Patient) => (
                <TableRow
                  key={patient.id}
                  hover
                  sx={tableRowSx}
                  data-patient-id={patient.id}
                  onClick={handlePatientRowClick}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                  >
                    <Box sx={cellContentBoxSx}>
                      <PersonIcon sx={personIconSx} />
                      <Typography variant="body1" fontWeight="medium">
                        {patient.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={cellContentBoxSx}>
                      <EmailIcon sx={contactIconSx} />
                      {patient.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={cellContentBoxSx}>
                      <PhoneIcon sx={contactIconSx} />
                      {patient.phone}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={cellContentBoxSx}>
                      <CalendarIcon sx={contactIconSx} />
                      {formatDate(patient.dateOfBirth)}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('patients.table.viewDetails')}>
                      <IconButton 
                        color="primary" 
                        onClick={handleViewDetailsClick}
                        size="small"
                        data-patient-id={patient.id}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {patients.length === 0 && !searchQuery && (
        <Box sx={emptyStateBoxSx}>
          <Typography variant="h6" color="text.secondary">
            {t('patients.noPatients')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={addButtonSx}
          >
            {t('patients.addFirst')}
          </Button>
        </Box>
      )}

      {patients.length === 0 && searchQuery && (
        <Box sx={emptyStateBoxSx}>
          <Typography variant="h6" color="text.secondary">
            {t('patients.noSearchResults')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={searchEmptyDescriptionSx}>
            {t('patients.tryDifferentSearch')}
          </Typography>
        </Box>
      )}

      <AddPatientDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddPatient}
      />
    </Container>
  );
};

export default PatientsListPage;
