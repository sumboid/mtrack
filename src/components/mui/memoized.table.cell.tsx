import React from 'react';
import { TableCell as MuiTableCell, type TableCellProps } from '@mui/material';

export const TableCell = React.memo(
  React.forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => (
    <MuiTableCell {...props} ref={ref} />
  ))
);
TableCell.displayName = 'TableCell';
