import React from 'react';
import { Menu as MuiMenu, type MenuProps } from '@mui/material';

export const Menu = React.memo(
  React.forwardRef<HTMLDivElement, MenuProps>((props, ref) => (
    <MuiMenu {...props} ref={ref} />
  ))
);
Menu.displayName = 'Menu';
