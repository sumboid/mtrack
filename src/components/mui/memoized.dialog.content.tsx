import React from 'react';
import { DialogContent as MuiDialogContent, type DialogContentProps } from '@mui/material';

export const DialogContent = React.memo(
  React.forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => (
    <MuiDialogContent {...props} ref={ref} />
  ))
);
DialogContent.displayName = 'DialogContent';
