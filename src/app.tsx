import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from './components/mui';
import { useMemo, useEffect, lazy, Suspense, useCallback } from 'react';
import { createAppTheme, THEME_COLORS } from './theme';
import Navigation from './components/navigation.component';
import { PWAUpdateNotification } from './components/pwa.update.notification.component';
import { useMachine } from '@xstate/react';
import { themeMachine } from './fsm/theme.machine';
import { AppActorProvider } from './contexts/app.actor.context';

const PatientsListPage = lazy(() => import('./pages/patients.list.page'));
const PatientDetailsPage = lazy(() => import('./pages/patient.details.page'));
const EditPatientPage = lazy(() => import('./pages/edit.patient.page'));

function App() {
  const [state, send] = useMachine(themeMachine);

  const toggleTheme = useCallback(() => {
    send({ type: 'TOGGLE' });
  }, [send]);

  const theme = useMemo(() => createAppTheme(state.context.mode), [state.context.mode]);
  
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[state.context.mode]);
  }, [state.context.mode]);
  
  return (
    <AppActorProvider>
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
            <Navigation mode={state.context.mode} toggleTheme={toggleTheme} />
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
    </AppActorProvider>
  );
}

export default App
