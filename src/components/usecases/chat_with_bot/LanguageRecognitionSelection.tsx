import { Button, ButtonGroup } from "@mui/material";
import React from "react";

export enum LanguageRecognitionOption {
  onlySwissGerman = "Schweizerdeutsch",
  auto = "Automatisch",
}

interface LanguageRecognitionSelectionProps {
  onChange: (language: LanguageRecognitionOption) => void;
  selected: LanguageRecognitionOption;
}

export const LanguageRecognitionSelection: React.FC<
  LanguageRecognitionSelectionProps
> = ({ onChange, selected }) => {
  return (
    <ButtonGroup disableElevation variant="outlined">
      {Object.values(LanguageRecognitionOption).map((item, i) => (
        <Button
          variant={item === selected ? "contained" : "outlined"}
          key={i}
          onClick={() => onChange(item)}
        >
          {item}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default LanguageRecognitionSelection;
