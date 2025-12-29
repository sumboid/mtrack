import React from 'react';
import { Avatar as MuiAvatar, type AvatarProps } from '@mui/material';

export const Avatar = React.memo(
  React.forwardRef<HTMLDivElement, AvatarProps>((props, ref) => (
    <MuiAvatar {...props} ref={ref} />
  ))
);
Avatar.displayName = 'Avatar';
