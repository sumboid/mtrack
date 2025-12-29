import React from 'react';
import { Chip as MuiChip, type ChipProps } from '@mui/material';

export const Chip = React.memo(
  React.forwardRef<HTMLDivElement, ChipProps>((props, ref) => (
    <MuiChip {...props} ref={ref} />
  ))
);
Chip.displayName = 'Chip';
