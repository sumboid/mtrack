import React from 'react';
import { Alert as MuiAlert, type AlertProps } from '@mui/material';

export const Alert = React.memo(
  React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <MuiAlert {...props} ref={ref} />
  ))
);
Alert.displayName = 'Alert';
