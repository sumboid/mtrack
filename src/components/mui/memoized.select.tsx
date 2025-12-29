import React from 'react';
import { Select as MuiSelect, type SelectProps } from '@mui/material';

export const Select = React.memo(
  React.forwardRef<HTMLDivElement, SelectProps>((props, ref) => (
    <MuiSelect {...props} ref={ref} />
  ))
);

Select.displayName = 'Select';
