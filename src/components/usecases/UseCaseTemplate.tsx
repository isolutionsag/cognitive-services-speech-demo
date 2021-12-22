import { VolumeUp } from "@mui/icons-material";
import { Button, Grid, Typography, Divider, Alert } from "@mui/material";
import React from "react";
import { Voice } from "../../util/TextToSpechVoices";
import { UseCaseModel } from "../../util/UseCase";
import SpeechComponentProps from "../SpeechComponentProps";

interface UseCaseTemplateProps extends SpeechComponentProps {
  model: UseCaseModel;
  error: string;
}

export interface UseCaseTemplateChildProps extends SpeechComponentProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const UseCaseTemplate: React.FC<UseCaseTemplateProps> = ({
  model,
  error,
  children,
  synthesizeSpeech,
  isSynthesizing,
}) => {
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      direction="column"
    >
      <Typography variant="h3">{model.title}</Typography>
      <br />
      <Typography variant="h6">{model.description}</Typography>
      <Button
        style={{ marginTop: "8x" }}
        onClick={() =>
          synthesizeSpeech(model.description, Voice.de_CH_LeniNeural)
        }
        disabled={isSynthesizing}
        variant="outlined"
        size="small"
        startIcon={<VolumeUp />}
      >
        Anleitung vorlesen
      </Button>
      <br />
      <Divider variant="middle" sx={{ width: "100%" }} />
      <br />
      {error !== "" && <Alert severity="error">{error}</Alert>}
      <br />
      {children}
    </Grid>
  );
};

export default UseCaseTemplate;
