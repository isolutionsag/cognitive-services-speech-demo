import { Stack } from "@mui/material";
import React from "react";

interface CustomIconButtonProps {
  icon: JSX.Element;
  text: string;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({ icon, text }) => {
  return (
    <Stack direction="column" alignItems="center" justifyContent="center">
      {icon}
      {text}
    </Stack>
  );
};

export default CustomIconButton;
