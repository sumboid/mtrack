import React from 'react';
import { Container as MuiContainer, type ContainerProps } from '@mui/material';

export const Container = React.memo(
  React.forwardRef<HTMLDivElement, ContainerProps>((props, ref) => (
    <MuiContainer {...props} ref={ref} />
  ))
);
Container.displayName = 'Container';
