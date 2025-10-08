import { createTheme } from '@mui/material/styles';
import { categoryColors } from './palette';

declare module '@mui/material/styles' {
  interface Palette {
    category: typeof categoryColors;
  }
  interface PaletteOptions {
    category?: typeof categoryColors;
  }
}

const darkPalette = {
  primary: {
    main: '#00e5ff',
    light: '#6effff',
    dark: '#00b2cc',
  },
  secondary: {
    main: '#7c4dff',
    light: '#b47cff',
    dark: '#3f1dcb',
  },
  background: {
    default: '#0a1929',
    paper: '#132f4c',
  },
  text: {
    primary: '#e3f2fd',
    secondary: '#b0bec5',
  },
  divider: 'rgba(0, 229, 255, 0.08)',
  action: {
    hover: 'rgba(0, 229, 255, 0.08)',
    selected: 'rgba(0, 229, 255, 0.12)',
  },
};

const lightPalette = {
  primary: {
    main: '#0097a7',
    light: '#4dd0e1',
    dark: '#006064',
  },
  secondary: {
    main: '#6a1b9a',
    light: '#9c27b0',
    dark: '#4a148c',
  },
  background: {
    default: '#eceff1',
    paper: '#ffffff',
  },
  text: {
    primary: '#263238',
    secondary: '#546e7a',
  },
  divider: 'rgba(0, 151, 167, 0.08)',
  action: {
    hover: 'rgba(0, 151, 167, 0.04)',
    selected: 'rgba(0, 151, 167, 0.08)',
  },
};

const commonTheme = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
};

const getDarkComponents = () => ({
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid rgba(0, 229, 255, 0.08)',
      },
      head: {
        fontWeight: 600,
        backgroundColor: '#0d2136',
        borderBottom: '2px solid rgba(0, 229, 255, 0.08)',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 500,
        borderRadius: 8,
        transition: 'all 0.2s ease',
      },
      contained: {
        boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
        '&:hover': {
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
      outlined: {
        borderWidth: '1.5px',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: '#0a1929',
        color: '#e3f2fd',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(0, 229, 255, 0.08)',
        },
      },
    },
  },
});

const getLightComponents = () => ({
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid rgba(0, 151, 167, 0.08)',
      },
      head: {
        fontWeight: 600,
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid rgba(0, 151, 167, 0.08)',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 500,
        borderRadius: 8,
        transition: 'all 0.2s ease',
      },
      contained: {
        boxShadow: '0 2px 8px rgba(0, 151, 167, 0.25)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 151, 167, 0.35)',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
      outlined: {
        borderWidth: '1.5px',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: '#ffffff',
        color: '#263238',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(0, 151, 167, 0.04)',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  const components = mode === 'dark' ? getDarkComponents() : getLightComponents();

  return createTheme({
    ...commonTheme,
    palette: {
      mode,
      ...palette,
      category: categoryColors,
    },
    components,
  });
};
