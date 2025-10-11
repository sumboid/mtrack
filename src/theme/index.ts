import { createTheme } from '@mui/material/styles';
import { categoryColors } from './palette';
import { THEME_COLORS } from '../constants/theme';

export { THEME_COLORS };

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
    main: '#7278F2', // Vibrant blue from palette
    light: '#9EA3F5',
    dark: '#5159C9',
  },
  secondary: {
    main: '#F2766B', // Coral/salmon accent
    light: '#FF9C93',
    dark: '#D9564C',
  },
  background: {
    default: THEME_COLORS.dark, // Darker version of The-Games-We-Loved-2
    paper: '#152030', // Slightly lighter, based on The-Games-We-Loved-2
  },
  text: {
    primary: '#EFF2D8', // Cream from palette
    secondary: '#B8C4D9', // Lighter version of The-Games-We-Loved-3
  },
  divider: 'rgba(105, 158, 191, 0.12)', // Using The-Games-We-Loved-3
  action: {
    hover: 'rgba(114, 120, 242, 0.08)', // Using primary color
    selected: 'rgba(114, 120, 242, 0.16)',
  },
};

const lightPalette = {
  primary: {
    main: '#064973', // Deep blue from palette (The-Games-We-Loved-2)
    light: '#699EBF', // Mid-tone blue (The-Games-We-Loved-3)
    dark: '#033A5C',
  },
  secondary: {
    main: '#F2766B', // Coral/salmon accent (same as dark mode)
    light: '#FF9C93',
    dark: '#D9564C',
  },
  background: {
    default: THEME_COLORS.light, // Light version of cream
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0A0F1A', // Dark blue-black for text
    secondary: '#064973', // Deep blue for secondary text
  },
  divider: 'rgba(105, 158, 191, 0.15)', // Using The-Games-We-Loved-3
  action: {
    hover: 'rgba(6, 73, 115, 0.04)', // Using primary color
    selected: 'rgba(6, 73, 115, 0.08)',
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
        borderBottom: '1px solid rgba(105, 158, 191, 0.12)',
      },
      head: {
        fontWeight: 600,
        backgroundColor: '#0D1520',
        borderBottom: '2px solid rgba(114, 120, 242, 0.2)',
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
        boxShadow: '0 0 15px rgba(114, 120, 242, 0.25)',
        '&:hover': {
          boxShadow: '0 0 20px rgba(114, 120, 242, 0.4)',
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
        backgroundColor: '#0A0F1A',
        color: '#EFF2D8',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(114, 120, 242, 0.08)',
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
        borderBottom: '1px solid rgba(105, 158, 191, 0.15)',
      },
      head: {
        fontWeight: 600,
        backgroundColor: '#F0F4F7',
        borderBottom: '2px solid rgba(6, 73, 115, 0.2)',
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
        boxShadow: '0 2px 8px rgba(6, 73, 115, 0.2)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(6, 73, 115, 0.3)',
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
        backgroundColor: '#FFFFFF',
        color: '#0A0F1A',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(6, 73, 115, 0.04)',
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
