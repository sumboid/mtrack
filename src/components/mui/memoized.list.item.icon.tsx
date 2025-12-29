import React from 'react';
import { ListItemIcon as MuiListItemIcon, type ListItemIconProps } from '@mui/material';

export const ListItemIcon = React.memo(
  React.forwardRef<HTMLDivElement, ListItemIconProps>((props, ref) => (
    <MuiListItemIcon {...props} ref={ref} />
  ))
);
ListItemIcon.displayName = 'ListItemIcon';
