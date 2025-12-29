import React from 'react';
import { IconButton as MuiIconButton, type IconButtonProps } from '@mui/material';

export const IconButton = React.memo(
  React.forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => (
    <MuiIconButton {...props} ref={ref} />
  ))
);
IconButton.displayName = 'IconButton';
