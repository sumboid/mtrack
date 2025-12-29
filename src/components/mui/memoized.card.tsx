import React from 'react';
import { Card as MuiCard, type CardProps } from '@mui/material';

export const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>((props, ref) => (
    <MuiCard {...props} ref={ref} />
  ))
);
Card.displayName = 'Card';
