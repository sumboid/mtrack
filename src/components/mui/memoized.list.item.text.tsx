import React from 'react';
import { ListItemText as MuiListItemText, type ListItemTextProps } from '@mui/material';

export const ListItemText = React.memo(
  React.forwardRef<HTMLDivElement, ListItemTextProps>((props, ref) => (
    <MuiListItemText {...props} ref={ref} />
  ))
);
ListItemText.displayName = 'ListItemText';
