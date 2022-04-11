import { Stack } from "@mui/material";
import React from "react";

enum Gravity {
  Left = "flex-start",
  Right = "flex-end",
}

interface GravityItemsAreaProps {
  gravity?: Gravity;
  right?: boolean;
  left?: boolean;
  children?: React.ReactNode;
}

const GravityItemsArea: React.FC<GravityItemsAreaProps> = ({
  gravity,
  left = true,
  right,
  children,
}) => {
  if (!gravity) {
    if (right) gravity = Gravity.Right;
    else gravity = Gravity.Left;
  }
  return (
    <Stack alignItems="center" justifyContent={gravity} direction="row">
      {children}
    </Stack>
  );
};

export default GravityItemsArea;
