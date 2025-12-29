import React from 'react';
import { List as MuiList, type ListProps } from '@mui/material';

export const List = React.memo(
  React.forwardRef<HTMLUListElement, ListProps>((props, ref) => (
    <MuiList {...props} ref={ref} />
  ))
);
List.displayName = 'List';
