import styled from "@emotion/styled";
import { Tabs } from "@mui/material";

const StyledTabs = styled(Tabs)({
  backgroundColor: '#F2FAFF',
  zIndex: 1,
  '& .MuiTabs-indicator': {
    backgroundColor: '#FFFFFF',
  },
});

export default StyledTabs;