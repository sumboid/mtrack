import React from 'react';
import { Table as MuiTable, type TableProps } from '@mui/material';

export const Table = React.memo(
  React.forwardRef<HTMLTableElement, TableProps>((props, ref) => (
    <MuiTable {...props} ref={ref} />
  ))
);
Table.displayName = 'Table';
