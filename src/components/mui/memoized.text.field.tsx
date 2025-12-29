import React from 'react';
import { TextField as MuiTextField, type TextFieldProps } from '@mui/material';

export const TextField = React.memo(
  React.forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => (
    <MuiTextField {...props} ref={ref} />
  ))
);

TextField.displayName = 'TextField';
