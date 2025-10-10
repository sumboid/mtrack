import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './language.selector.component';
import { BackupDialog } from './backup.dialog.component';

interface NavigationProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ mode, toggleTheme }) => {
  const { t } = useTranslation();
  const [backupOpen, setBackupOpen] = useState(false);

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
              onClick={() => setBackupOpen(true)}
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
      <BackupDialog open={backupOpen} onClose={() => setBackupOpen(false)} />
    </AppBar>
  );
};

export default Navigation;
