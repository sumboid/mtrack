import React from 'react';
import { Box as MuiBox, type BoxProps } from '@mui/material';

export const Box = React.memo(
  React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
    <MuiBox {...props} ref={ref} />
  ))
);

Box.displayName = 'Box';
