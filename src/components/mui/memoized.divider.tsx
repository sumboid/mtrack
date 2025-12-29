import React from 'react';
import { Divider as MuiDivider, type DividerProps } from '@mui/material';

export const Divider = React.memo(
  React.forwardRef<HTMLHRElement, DividerProps>((props, ref) => (
    <MuiDivider {...props} ref={ref} />
  ))
);
Divider.displayName = 'Divider';
