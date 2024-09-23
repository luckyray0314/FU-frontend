import { Slider, SliderProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React from 'react';

export const StyledDateRange = styled((props: SliderProps) => (
  <Slider {...props} />
))(({ theme }) => ({
  flex: 1,
  '&.MuiSlider-root': {
    margin: "0px 16px",
    color: "#7BC29A"
  },
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
    },
  },
}));