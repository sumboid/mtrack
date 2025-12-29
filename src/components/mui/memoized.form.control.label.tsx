import React from 'react';
import { FormControlLabel as MuiFormControlLabel, type FormControlLabelProps } from '@mui/material';

export const FormControlLabel = React.memo(
  React.forwardRef<HTMLDivElement, FormControlLabelProps>((props, ref) => (
    <MuiFormControlLabel {...props} ref={ref} />
  ))
);
FormControlLabel.displayName = 'FormControlLabel';
