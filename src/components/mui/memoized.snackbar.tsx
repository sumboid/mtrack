import React from 'react';
import { Snackbar as MuiSnackbar, type SnackbarProps } from '@mui/material';

export const Snackbar = React.memo(
  React.forwardRef<HTMLDivElement, SnackbarProps>((props, ref) => (
    <MuiSnackbar {...props} ref={ref} />
  ))
);
Snackbar.displayName = 'Snackbar';
