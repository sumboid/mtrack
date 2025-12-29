import React from 'react';
import { Button as MuiButton, type ButtonProps } from '@mui/material';

export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <MuiButton {...props} ref={ref} />
  ))
);

Button.displayName = 'Button';
