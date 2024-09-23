import { styled, Tab, TabProps, Typography } from "@mui/material";
import React from "react";

function a11yProps() {
  return {
    id: `simple-tab`,
    'aria-controls': `simple-tabpanel`,
  };
}

const StyledTab = styled((props: TabProps) => (
  <Tab
    {...props}
    disableRipple
    icon={<Typography sx={{ fontSize: "70px", fontWeight: 700, lineHeight: "60px" }}>{props.icon}</Typography>}
    iconPosition="start"
    label={<Typography sx={{ fontSize: "18px", fontWeight: 600, textAlign: "left", lineHeight: "30px" }}>{props.label}</Typography>}
    {...a11yProps()}
  />
))(() => ({
  position: "relative",
  overflow: "unset",
  textTransform: "capitalize",
  color: "#839BAA",
  flex: 1,
  padding: "16px 32px",
  alignItems: "start",
  maxWidth: "300px",
  '&.Mui-selected': {
    zIndex: 2,
    color: "#334957",
  },
  '&.Mui-selected::before': {
    backgroundColor: "#FFFFFF"
  },
  '&::before': {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    backgroundColor: "#F2FAFF",
    boxShadow: "0 .15em white inset",
    transform: "scale(1.1, 10.3) perspective(.5em) rotateX(5deg)",
    transformOrigin: "bottom left"
  },
  '&:last-child::before': {
    transform: "rotateX(0deg)",
  }
}));

export default StyledTab;