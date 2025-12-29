import React from 'react';
import { Grid as MuiGrid, type GridProps } from '@mui/material';

export const Grid = React.memo(
  React.forwardRef<HTMLDivElement, GridProps>((props, ref) => (
    <MuiGrid {...props} ref={ref} />
  ))
);

Grid.displayName = 'Grid';
