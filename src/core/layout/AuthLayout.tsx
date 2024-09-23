import { Container, Paper } from "@mui/material";
import React from "react";

interface Props {
  children: any;
}

export default function AuthLayout({ children }: Props) {
  return (
    <Container maxWidth={false} className="bg-[#F2FAFF] h-[100vh] flex flex-col justify-center align-center">
      <Container maxWidth="lg">
        <Paper className="bg-[#7BC29A2B] flex flex-col justify-center items-center gap-[32px] py-[130px]">
          {children}
        </Paper>
      </Container>
    </Container>
  );
}