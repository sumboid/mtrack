import React from 'react';
import { TableBody as MuiTableBody, type TableBodyProps } from '@mui/material';

export const TableBody = React.memo(
  React.forwardRef<HTMLTableSectionElement, TableBodyProps>((props, ref) => (
    <MuiTableBody {...props} ref={ref} />
  ))
);
TableBody.displayName = 'TableBody';
