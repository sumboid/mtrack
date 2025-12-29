import React from 'react';
import { InputLabel as MuiInputLabel, type InputLabelProps } from '@mui/material';

export const InputLabel = React.memo(
  React.forwardRef<HTMLLabelElement, InputLabelProps>((props, ref) => (
    <MuiInputLabel {...props} ref={ref} />
  ))
);

InputLabel.displayName = 'InputLabel';
