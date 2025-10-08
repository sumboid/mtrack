import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useState, useMemo } from 'react';
import { createAppTheme } from './theme';
import Navigation from './components/navigation.component';
import PatientsListPage from './pages/patients.list.page';
import PatientDetailsPage from './pages/patient.details.page';
import EditPatientPage from './pages/edit.patient.page';
import { PWAUpdateNotification } from './components/pwa.update.notification.component';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'light' || savedMode === 'dark') ? savedMode : 'dark';
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PWAUpdateNotification />
      <Router basename="/mtrack">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}>
          <Navigation mode={mode} toggleTheme={toggleTheme} />
          <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<PatientsListPage />} />
              <Route path="/patient/:patientId" element={<PatientDetailsPage />} />
              <Route path="/patient/:patientId/edit" element={<EditPatientPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App
