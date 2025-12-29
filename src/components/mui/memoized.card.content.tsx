import React from 'react';
import { CardContent as MuiCardContent, type CardContentProps } from '@mui/material';

export const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, CardContentProps>((props, ref) => (
    <MuiCardContent {...props} ref={ref} />
  ))
);
CardContent.displayName = 'CardContent';
