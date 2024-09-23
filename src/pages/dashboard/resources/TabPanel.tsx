import { Box } from "@mui/material";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel`}
      aria-labelledby={`simple-tab`}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </div>
  );
}