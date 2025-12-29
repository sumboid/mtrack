import React from 'react';
import { DialogTitle as MuiDialogTitle, type DialogTitleProps } from '@mui/material';

export const DialogTitle = React.memo(
  React.forwardRef<HTMLDivElement, DialogTitleProps>((props, ref) => (
    <MuiDialogTitle {...props} ref={ref} />
  ))
);
DialogTitle.displayName = 'DialogTitle';
