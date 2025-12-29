import React from 'react';
import { ListItem as MuiListItem, type ListItemProps } from '@mui/material';

export const ListItem = React.memo(
  React.forwardRef<HTMLLIElement, ListItemProps>((props, ref) => (
    <MuiListItem {...props} ref={ref} />
  ))
);
ListItem.displayName = 'ListItem';
