import React from 'react';
import { Switch as MuiSwitch, type SwitchProps } from '@mui/material';

export const Switch = React.memo(
  React.forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => (
    <MuiSwitch {...props} ref={ref} />
  ))
);
Switch.displayName = 'Switch';
