import React from 'react';
import { TableHead as MuiTableHead, type TableHeadProps } from '@mui/material';

export const TableHead = React.memo(
  React.forwardRef<HTMLTableSectionElement, TableHeadProps>((props, ref) => (
    <MuiTableHead {...props} ref={ref} />
  ))
);
TableHead.displayName = 'TableHead';
