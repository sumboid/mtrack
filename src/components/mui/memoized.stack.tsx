import React from 'react';
import { Stack as MuiStack, type StackProps } from '@mui/material';

export const Stack = React.memo(
  React.forwardRef<HTMLDivElement, StackProps>((props, ref) => (
    <MuiStack {...props} ref={ref} />
  ))
);
Stack.displayName = 'Stack';
