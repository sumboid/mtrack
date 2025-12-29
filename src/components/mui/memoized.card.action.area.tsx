import React from 'react';
import { CardActionArea as MuiCardActionArea, type CardActionAreaProps } from '@mui/material';

export const CardActionArea = React.memo(
  React.forwardRef<HTMLButtonElement, CardActionAreaProps>((props, ref) => (
    <MuiCardActionArea {...props} ref={ref} />
  ))
);
CardActionArea.displayName = 'CardActionArea';
