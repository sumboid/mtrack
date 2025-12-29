import React from 'react';
import { Toolbar as MuiToolbar, type ToolbarProps } from '@mui/material';

export const Toolbar = React.memo(
  React.forwardRef<HTMLDivElement, ToolbarProps>((props, ref) => (
    <MuiToolbar {...props} ref={ref} />
  ))
);
Toolbar.displayName = 'Toolbar';
