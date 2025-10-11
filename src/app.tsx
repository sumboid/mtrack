import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { createAppTheme, THEME_COLORS } from './theme';
import Navigation from './components/navigation.component';
import { PWAUpdateNotification } from './components/pwa.update.notification.component';

const PatientsListPage = lazy(() => import('./pages/patients.list.page'));
const PatientDetailsPage = lazy(() => import('./pages/patient.details.page'));
const EditPatientPage = lazy(() => import('./pages/edit.patient.page'));

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
  
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[mode]);
  }, [mode]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PWAUpdateNotification />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}>
          <Navigation mode={mode} toggleTheme={toggleTheme} />
          <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={<Box sx={{ p: 3 }}>Loading...</Box>}>
              <Routes>
                <Route path="/" element={<PatientsListPage />} />
                <Route path="/patient/:patientId" element={<PatientDetailsPage />} />
                <Route path="/patient/:patientId/edit" element={<EditPatientPage />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App
