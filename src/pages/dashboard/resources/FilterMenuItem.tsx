import { ToggleButton, ToggleButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

export const FilterMenuItem = styled((props: ToggleButtonProps) => (
  <ToggleButton {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&.MuiToggleButton-root': {
    textTransform: "inherit",
    justifyContent: "left",
    textAlign: "left"
  },
}));