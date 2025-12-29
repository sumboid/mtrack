import React from 'react';
import { FormControl as MuiFormControl, type FormControlProps } from '@mui/material';

export const FormControl = React.memo(
  React.forwardRef<HTMLDivElement, FormControlProps>((props, ref) => (
    <MuiFormControl {...props} ref={ref} />
  ))
);

FormControl.displayName = 'FormControl';
