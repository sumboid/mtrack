import React from 'react';
import { TableContainer as MuiTableContainer, type TableContainerProps } from '@mui/material';

export const TableContainer = React.memo(
  React.forwardRef<HTMLDivElement, TableContainerProps>((props, ref) => (
    <MuiTableContainer {...props} ref={ref} />
  ))
);
TableContainer.displayName = 'TableContainer';
