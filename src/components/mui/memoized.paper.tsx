import React from 'react';
import { Paper as MuiPaper, type PaperProps } from '@mui/material';

export const Paper = React.memo(
  React.forwardRef<HTMLDivElement, PaperProps>((props, ref) => (
    <MuiPaper {...props} ref={ref} />
  ))
);
Paper.displayName = 'Paper';
