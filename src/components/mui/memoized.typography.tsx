import React from 'react';
import { Typography as MuiTypography, type TypographyProps } from '@mui/material';

export const Typography = React.memo(
  React.forwardRef<HTMLSpanElement, TypographyProps>((props, ref) => (
    <MuiTypography {...props} ref={ref} />
  ))
);
Typography.displayName = 'Typography';
