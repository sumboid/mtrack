import React from 'react';
import { TableRow as MuiTableRow, type TableRowProps } from '@mui/material';

export const TableRow = React.memo(
  React.forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => (
    <MuiTableRow {...props} ref={ref} />
  ))
);
TableRow.displayName = 'TableRow';
