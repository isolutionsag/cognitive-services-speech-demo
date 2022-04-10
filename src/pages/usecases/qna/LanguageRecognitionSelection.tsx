import { Button, ButtonGroup } from "@mui/material";
import React from "react";

export enum LanguageRecognitionOption {
  SwissGerman,
  Automatic,
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
      <Button variant={selected === LanguageRecognitionOption.SwissGerman ? "contained" : "outlined"}
        onClick={() => onChange(LanguageRecognitionOption.SwissGerman)}>
          Schweizerdeutsch
      </Button>
      <Button variant={selected === LanguageRecognitionOption.Automatic ? "contained" : "outlined"}
        onClick={() => onChange(LanguageRecognitionOption.Automatic)}>
          Automatisch
      </Button>
    </ButtonGroup>
  );
};

export default LanguageRecognitionSelection;
