import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  MedicalServices as MedicalIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './language.selector.component';

interface NavigationProps {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ mode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
              mr: 4,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {t('navigation.title')}
          </Typography>
          
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: location.pathname === '/' 
                ? 'action.selected'
                : 'transparent',
              color: location.pathname === '/' ? 'primary.main' : 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'primary.main',
              },
              borderRadius: 2,
              px: 2,
              transition: 'all 0.2s ease',
            }}
          >
            {t('navigation.patients')}
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
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
    </AppBar>
  );
};

export default Navigation;
