import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Avatar,
  Divider,
  Paper,
  List,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useActor, useMachine } from '@xstate/react';
import { patientMachine } from '../fsm/list.machine';
import { createMedicalHistoryMachine, type CreatePointRecordParams, type CreateContinuousRecordParams } from '../fsm/medical.history.machine';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategoryDefs } from '../models/config';
import { AddMedicalRecordDialog, EditMedicalRecordDialog } from '../components/medical.record.dialog.component';
import { DiagnosisDisplayFactory } from '../components/diagnoses/diagnosis.factory.component';
import { MedicalRecordListItem } from '../components/medical.record.list.item.component';

// SX Props
const containerSx = { mt: 4, mb: 4 };
const backButtonSx = { mb: 3 };
const backButtonNotFoundSx = { mb: 2 };
const avatarSx = { bgcolor: 'primary.main', width: 80, height: 80, mb: 2 };
const personIconSx = { fontSize: 40 };
const dividerSx = { mb: 2 };
const infoBoxSx = { mb: 2 };
const iconSx = { fontSize: 20, mr: 1, color: 'text.secondary' };
const medicalIconSx = { mr: 1 };
const emptyStatePaperSx = { p: 3, textAlign: 'center', bgcolor: 'action.hover' };
const addFirstButtonSx = { mt: 2 };

// Grid sizes
const patientInfoGridSize = { xs: 12, md: 4 };
const medicalHistoryGridSize = { xs: 12, md: 8 };
const gridSpacing = 3;

// Treatment display sx - used in renderRecordDetails callback
const treatmentSx = { mb: 1 };

const PatientDetailsPage: React.FC = () => {
  const [state] = useActor(patientMachine);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  // Create machine for this patient - will auto-load on creation
  const medicalHistoryMachine = React.useMemo(
    () => patientId ? createMedicalHistoryMachine(patientId) : null,
    [patientId]
  );
  const [historyState, historySend] = useMachine(medicalHistoryMachine!);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [recordToEdit, setRecordToEdit] = React.useState<MedicalHistoryRecord | null>(null);

  const patient = React.useMemo(() => {
    return state.context.patients.find(p => p.id === patientId);
  }, [state.context.patients, patientId]);

  const handleAddRecord = (data: CreatePointRecordParams | CreateContinuousRecordParams, keepDialogOpen?: boolean) => {
    if ('startDate' in data && 'endDate' in data) {
      historySend({ type: 'ADD_CONTINUOUS_RECORD', params: data as CreateContinuousRecordParams });
    } else {
      historySend({ type: 'ADD_POINT_RECORD', params: data as CreatePointRecordParams });
    }
    // Only close dialog if not in "Save and Add Next" mode
    if (!keepDialogOpen) {
      setAddDialogOpen(false);
    }
  };

  const handleUpdateRecord = (record: MedicalHistoryRecord) => {
    historySend({ type: 'UPDATE_RECORD', record });
    setEditDialogOpen(false);
    setRecordToEdit(null);
  };

  const formatDate = React.useCallback((date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }, []);

  const calculateAge = React.useCallback((birthDate: Date | string) => {
    const today = new Date();
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, []);

  const handleEditRecord = React.useCallback((record: MedicalHistoryRecord) => {
    setRecordToEdit(record);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteRecord = React.useCallback((record: MedicalHistoryRecord) => {
    historySend({ type: 'DELETE_RECORD', recordId: record.id });
  }, [historySend]);

  const formatDateTime = React.useCallback((date: Date) => {
    return date.toLocaleDateString();
  }, []);

  // Helper function to translate enum values like response types
  const translateEnumValue = React.useCallback((value: string, prefix: string = '') => {
    // Convert kebab-case to camelCase for translation keys
    const camelCase = value.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const translationKey = prefix ? `${prefix}.${camelCase}` : `patientDetails.${camelCase}`;
    
    // Try to get translation, fallback to formatted value if not found
    const translated = t(translationKey);
    if (translated === translationKey) {
      // Fallback: convert "stable-disease" to "Stable Disease"
      return value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return translated;
  }, [t]);

  const renderRecordDetails = React.useCallback((record: MedicalHistoryRecord) => {
    switch (record.category) {
      case 'surgery':
        return (
          <>
            {record.surgeryType && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.surgeryType')}:</strong> {record.surgeryType}
              </Typography>
            )}
            {record.location && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.location')}:</strong> {record.location}
              </Typography>
            )}
            {record.outcome && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.outcome')}:</strong> {record.outcome}
              </Typography>
            )}
          </>
        );
      
      case 'chemotherapy':
        return (
          <>
            {record.regimen && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.regimen')}:</strong> {record.regimen}
              </Typography>
            )}
            {record.cycles && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.cycles')}:</strong> {record.cycles}
              </Typography>
            )}
            {record.response && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.response')}:</strong> {translateEnumValue(record.response, 'patientDetails')}
              </Typography>
            )}
          </>
        );
      
      case 'radiotherapy':
        return (
          <>
            {record.targetArea && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.targetArea')}:</strong> {record.targetArea}
              </Typography>
            )}
            {record.totalDose && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.totalDose')}:</strong> {record.totalDose} Gy
              </Typography>
            )}
          </>
        );
      
      case 'immunotherapy':
        return (
          <>
            {record.agent && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.agent')}:</strong> {record.agent}
              </Typography>
            )}
            {record.response && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.response')}:</strong> {translateEnumValue(record.response, 'patientDetails')}
              </Typography>
            )}
          </>
        );
      
      case 'lab_test':
        return (
          <>
            {record.testType && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.testType')}:</strong> {record.testType}
              </Typography>
            )}
            {record.results && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.results')}:</strong> {record.results}
              </Typography>
            )}
          </>
        );
      
      case 'imaging':
        return (
          <>
            {record.imagingType && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.imagingType')}:</strong> {record.imagingType}
              </Typography>
            )}
            {record.findings && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.findings')}:</strong> {record.findings}
              </Typography>
            )}
          </>
        );
      
      case 'hospitalization':
        return (
          <>
            {record.reason && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.reason')}:</strong> {record.reason}
              </Typography>
            )}
            {record.department && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.department')}:</strong> {record.department}
              </Typography>
            )}
          </>
        );
      
      case 'diagnosis':
        return (
          <>
            {record.diagnosisName && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.diagnosisName')}:</strong> {record.diagnosisName}
              </Typography>
            )}
          </>
        );
      
      case 'follow_up':
        return (
          <>
            {record.findings && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.findings')}:</strong> {record.findings}
              </Typography>
            )}
          </>
        );
      
      case 'consultation':
        return (
          <>
            {record.specialist && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.specialist')}:</strong> {record.specialist}
              </Typography>
            )}
            {record.reason && (
              <Typography variant="body2" color="text.secondary">
                <strong>{t('patientDetails.reason')}:</strong> {record.reason}
              </Typography>
            )}
          </>
        );
      
      case 'other':
        return (
          <>
            {record.description && (
              <Typography variant="body1" sx={treatmentSx}>
                <strong>{t('patientDetails.description')}:</strong> {record.description}
              </Typography>
            )}
          </>
        );
    }
  }, [t, translateEnumValue]);

  const getCategoryColor = React.useCallback((category: MedicalRecordCategory): string => {
    return CategoryDefs[category].color || 'primary';
  }, []);

  const getCategoryName = React.useCallback((category: MedicalRecordCategory) => {
    return t(CategoryDefs[category].translationKey);
  }, [t]);

  const sortedRecords = React.useMemo(() => 
    [...historyState.context.records].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [historyState.context.records]
  );

  const handleBackToPatients = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleEditPatient = React.useCallback(() => {
    if (patient) {
      navigate(`/patient/${patient.id}/edit`);
    }
  }, [navigate, patient]);

  const handleOpenAddDialog = React.useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const handleCloseAddDialog = React.useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  const handleCloseEditDialog = React.useCallback(() => {
    setEditDialogOpen(false);
    setRecordToEdit(null);
  }, []);
  
  if (state.matches('loading')) {
    return (
      <Container maxWidth="xl" sx={containerSx}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('patientDetails.loading')}
        </Typography>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="xl" sx={containerSx}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToPatients}
          sx={backButtonNotFoundSx}
        >
          {t('patientDetails.backToPatients')}
        </Button>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          {t('patientDetails.notFound')}
        </Typography>
        <Typography variant="body1">
          {t('patientDetails.notFoundDescription')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={containerSx}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToPatients}
        sx={backButtonSx}
      >
        {t('patientDetails.backToPatients')}
      </Button>

      <Grid container spacing={gridSpacing}>
        {/* Patient Info Card */}
        <Grid size={patientInfoGridSize}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar sx={avatarSx}>
                  <PersonIcon sx={personIconSx} />
                </Avatar>
                <Typography variant="h5" component="h1" textAlign="center">
                  {patient.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {t('patientDetails.patientId')}: {patient.id}
                </Typography>
              </Box>

              <Divider sx={dividerSx} />

              <Box sx={infoBoxSx}>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon sx={iconSx} />
                  <Typography variant="body1">{patient.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={iconSx} />
                  <Typography variant="body1">{patient.phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarIcon sx={iconSx} />
                  <Typography variant="body1">
                    {formatDate(patient.dateOfBirth)} ({t('patientDetails.yearsOld', { age: calculateAge(patient.dateOfBirth) })})
                  </Typography>
                </Box>
              </Box>

              {patient.diagnosis && (
                <>
                  <Divider sx={dividerSx} />
                  <Box sx={infoBoxSx}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('patient.form.diagnosis')}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {t(`diagnosis.breastCancer.name`)}
                    </Typography>
                    <Box mt={1}>
                      <DiagnosisDisplayFactory
                        type={patient.diagnosis.diagnosis}
                        details={patient.diagnosis.details}
                      />
                    </Box>
                  </Box>
                </>
              )}

              {patient.notes && (
                <>
                  <Divider sx={dividerSx} />
                  <Box sx={infoBoxSx}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {t('patient.form.notes')}
                    </Typography>
                    <Typography variant="body2">
                      {patient.notes}
                    </Typography>
                  </Box>
                </>
              )}

              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                onClick={handleEditPatient}
              >
                {t('patientDetails.editPatient')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History Card */}
        <Grid size={medicalHistoryGridSize}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h2" display="flex" alignItems="center">
                  <MedicalIcon sx={medicalIconSx} />
                  {t('patientDetails.medicalHistory')}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                >
                  {t('patientDetails.addRecord')}
                </Button>
              </Box>

              {historyState.matches('loading') ? (
                <Paper elevation={0} sx={emptyStatePaperSx}>
                  <Typography variant="body1" color="text.secondary">
                    {t('patientDetails.loading')}
                  </Typography>
                </Paper>
              ) : historyState.context.records.length === 0 ? (
                <Paper elevation={0} sx={emptyStatePaperSx}>
                  <Typography variant="body1" color="text.secondary">
                    {t('patientDetails.noMedicalRecords')}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                    sx={addFirstButtonSx}
                  >
                    {t('patientDetails.addFirstRecord')}
                  </Button>
                </Paper>
              ) : (
                <List>
                  {sortedRecords.map((record) => (
                    <MedicalRecordListItem
                      key={record.id}
                      record={record}
                      getCategoryName={getCategoryName}
                      getCategoryColor={getCategoryColor}
                      formatDate={formatDate}
                      formatDateTime={formatDateTime}
                      renderRecordDetails={renderRecordDetails}
                      onEdit={handleEditRecord}
                      onDelete={handleDeleteRecord}
                    />
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {patient && (
        <>
          <AddMedicalRecordDialog
            open={addDialogOpen}
            onClose={handleCloseAddDialog}
            patientId={patient.id}
            patientName={patient.name}
            onSubmit={handleAddRecord}
          />
          {recordToEdit && (
            <EditMedicalRecordDialog
              open={editDialogOpen}
              onClose={handleCloseEditDialog}
              patientId={patient.id}
              patientName={patient.name}
              record={recordToEdit}
              onSubmit={handleUpdateRecord}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default PatientDetailsPage;
