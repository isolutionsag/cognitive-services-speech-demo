import React from "react";
import { Button, ButtonGroup } from "@mui/material";

interface CustomToggleButtonItem {
  value: any;
  text: string;
}

interface CustomToggleButtonGroupProps {
  value: any;
  onChange: (value: any) => void;
  items: CustomToggleButtonItem[];
}

// like a toggle button but with text buttons (see https://mui.com/components/toggle-button)
const CustomToggleButtonGroup: React.FC<CustomToggleButtonGroupProps> = ({
  value,
  onChange,
  items,
}) => {
  return (
    <ButtonGroup disableElevation variant="outlined">
      {items.map((item, i) => (
        <Button
          variant={value === item.value ? "contained" : "outlined"}
          key={i}
          onClick={() => onChange(item.value)}
        >
          {item.text}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default CustomToggleButtonGroup;
