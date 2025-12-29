import React from 'react';
import { MenuItem as MuiMenuItem, type MenuItemProps } from '@mui/material';

export const MenuItem = React.memo(
  React.forwardRef<HTMLLIElement, MenuItemProps>((props, ref) => (
    <MuiMenuItem {...props} ref={ref} />
  ))
);
MenuItem.displayName = 'MenuItem';
