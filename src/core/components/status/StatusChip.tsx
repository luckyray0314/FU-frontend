import Stack from "@mui/material/Stack";
import React, { ReactNode } from "react";
import { SurveyStatus } from "../../model/status.model";
import StatusCircle from "./StatusCircle";

interface Props {
  status: string,
  variant: "small" | "medium" | "large",
  circlePosition: "left" | "right" | "top" | "bottom",
  content: ReactNode;
}

export default function StatusChip({
  status,
  variant,
  circlePosition,
  content
}: Props) {
  const directionMap: {
    [circlePosition: string]: "row" | "row-reverse" | "column" | "column-reverse";
  } = {
    "left": "row",
    "right": "row-reverse",
    "top": "column",
    "bottom": "column-reverse",
  };

  return (
    <Stack
      direction={directionMap[circlePosition]}
      alignItems="center"
      gap={1}
    >
      <StatusCircle variant={variant} status={status} />
      {content}
    </Stack>
  );
}