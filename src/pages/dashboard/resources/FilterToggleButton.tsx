import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';

export const FilterToggleButton = styled((props: ToggleButtonProps) => (
  <ToggleButton {...props} disableRipple />
))(({ theme }) => ({
  color: "white",
  backgroundColor: "#BFDDB9",
  textTransform: "capitalize",
  fontSize: "16px",
  fontWeight: "bold",
  '&:first-of-type': {
    borderTopLeftRadius: "40px",
    borderBottomLeftRadius: "40px",
  },
  '&:last-of-type': {
    borderTopRightRadius: "40px",
    borderBottomRightRadius: "40px",
  },
  '&:hover': {
    backgroundColor: "#9cc095"
  },
  '&.Mui-selected': {
    color: "white",
    backgroundColor: theme.palette.success.main
  },
  '&.Mui-selected:hover': {
    backgroundColor: "#015744"
  }
}));