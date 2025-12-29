import React from 'react';
import { Tooltip as MuiTooltip, type TooltipProps } from '@mui/material';

export const Tooltip = React.memo(
  React.forwardRef<HTMLDivElement, TooltipProps>((props, ref) => (
    <MuiTooltip {...props} ref={ref} />
  ))
);
Tooltip.displayName = 'Tooltip';
