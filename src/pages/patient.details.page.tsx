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
  ListItem,
  Chip,
  IconButton,
  Menu,
  MenuItem,
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
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useActor, useMachine } from '@xstate/react';
import { patientMachine } from '../fsm/list.machine';
import { createMedicalHistoryMachine, type CreatePointRecordParams, type CreateContinuousRecordParams } from '../fsm/medical.history.machine';
import type { MedicalHistoryRecord, MedicalRecordCategory } from '../models/medical.history.model';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CategoryDefs } from '../models/config';
import { AddMedicalRecordDialog, EditMedicalRecordDialog } from '../components/medical.record.dialog.component';

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
const treatmentSx = { mb: 1 };
const dateRangeSx = { mb: 0.5 };
const menuIconSx = { mr: 1 };

// Grid sizes
const patientInfoGridSize = { xs: 12, md: 4 };
const medicalHistoryGridSize = { xs: 12, md: 8 };
const gridSpacing = 3;
const headerGap = 1;

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = React.useState<MedicalHistoryRecord | null>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [recordToEdit, setRecordToEdit] = React.useState<MedicalHistoryRecord | null>(null);

  const patient = React.useMemo(() => {
    return state.context.patients.find(p => p.id === patientId);
  }, [state.context.patients, patientId]);

  const handleAddRecord = (data: CreatePointRecordParams | CreateContinuousRecordParams) => {
    if ('startDate' in data && 'endDate' in data) {
      historySend({ type: 'ADD_CONTINUOUS_RECORD', params: data as CreateContinuousRecordParams });
    } else {
      historySend({ type: 'ADD_POINT_RECORD', params: data as CreatePointRecordParams });
    }
    setAddDialogOpen(false);
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

  const handleMenuOpen = React.useCallback((event: React.MouseEvent<HTMLElement>, record: MedicalHistoryRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  }, []);

  const handleMenuClose = React.useCallback(() => {
    setAnchorEl(null);
    setSelectedRecord(null);
  }, []);

  const handleDeleteRecord = React.useCallback(() => {
    if (selectedRecord) {
      historySend({ type: 'DELETE_RECORD', recordId: selectedRecord.id });
      handleMenuClose();
    }
  }, [selectedRecord, historySend, handleMenuClose]);

  const formatDateTime = React.useCallback((date: Date) => {
    return date.toLocaleDateString();
  }, []);

  const getCategoryColor = React.useCallback((category: MedicalRecordCategory) => {
    return CategoryDefs[category].color;
  }, []);

  const getCategoryName = React.useCallback((category: MedicalRecordCategory) => {
    return t(CategoryDefs[category].translationKey);
  }, [t]);

  const handleEditClick = React.useCallback(() => {
    if (selectedRecord) {
      setRecordToEdit(selectedRecord);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  }, [selectedRecord, handleMenuClose]);

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
      <Container maxWidth="lg" sx={containerSx}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('patientDetails.loading')}
        </Typography>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="lg" sx={containerSx}>
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
    <Container maxWidth="lg" sx={containerSx}>
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

              {(patient.diagnosis || patient.notes) && (
                <>
                  <Divider sx={dividerSx} />
                  {patient.diagnosis && (
                    <Box sx={infoBoxSx}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {t('patient.form.diagnosis')}
                      </Typography>
                      <Typography variant="body2">
                        {patient.diagnosis}
                      </Typography>
                    </Box>
                  )}
                  {patient.notes && (
                    <Box sx={infoBoxSx}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {t('patient.form.notes')}
                      </Typography>
                      <Typography variant="body2">
                        {patient.notes}
                      </Typography>
                    </Box>
                  )}
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
                <Box display="flex" gap={headerGap}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                  >
                    {t('patientDetails.addRecord')}
                  </Button>
                </Box>
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
                      <ListItem
                        key={record.id}
                        sx={listItemSx}
                      >
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
                          
                          {record.treatment && (
                            <Typography variant="body1" sx={treatmentSx}>
                              <strong>{t('patientDetails.treatment')}:</strong> {record.treatment}
                            </Typography>
                          )}
                          
                          {record.startDate && (
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
                          onClick={(e) => handleMenuOpen(e, record)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={menuIconSx} fontSize="small" />
          {t('common.edit')}
        </MenuItem>
        <MenuItem onClick={handleDeleteRecord}>
          <DeleteIcon sx={menuIconSx} fontSize="small" />
          {t('common.delete')}
        </MenuItem>
      </Menu>

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
