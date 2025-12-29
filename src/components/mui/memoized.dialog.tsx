import React from 'react';
import { Dialog as MuiDialog, type DialogProps } from '@mui/material';

export const Dialog = React.memo(
  React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => (
    <MuiDialog {...props} ref={ref} />
  ))
);
Dialog.displayName = 'Dialog';
