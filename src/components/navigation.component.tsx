import React, { useCallback } from 'react';
import { AppBar } from '@mui/material';
import {
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from './mui';
import {
  MedicalServices as MedicalIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMachine } from '@xstate/react';
import { backupMachine } from '../fsm/backup.machine';
import LanguageSelector from './language.selector.component';
import { BackupDialog } from './backup.dialog.component';

interface NavigationProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = React.memo(({ mode, toggleTheme }) => {
  const { t } = useTranslation();
  const [backupState, backupSend] = useMachine(backupMachine);

  const handleBackupOpen = useCallback(() => backupSend({ type: 'OPEN_DIALOG' }), [backupSend]);
  const handleBackupClose = useCallback(() => backupSend({ type: 'CLOSE_DIALOG' }), [backupSend]);

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <MedicalIcon 
            sx={{ 
              mr: 2, 
              fontSize: 28,
              color: 'primary.main',
            }} 
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' }, // Hide on mobile
            }}
          >
            {t('navigation.title')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Backup & Storage">
            <IconButton 
              color="inherit" 
              onClick={handleBackupOpen}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <BackupIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'dark' ? t('navigation.lightMode') : t('navigation.darkMode')}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <LanguageSelector />
        </Box>
      </Toolbar>
      <BackupDialog 
        open={backupState.context.dialogOpen} 
        onClose={handleBackupClose}
        backupState={backupState}
        backupSend={backupSend}
      />
    </AppBar>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
