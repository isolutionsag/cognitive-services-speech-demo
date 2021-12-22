import { VolumeUp } from "@mui/icons-material";
import { Button, Grid, Typography, Divider, Alert } from "@mui/material";
import React, { useEffect } from "react";
import MySpeechConfig from "../../models/MySpeechConfig";
import { UseCaseModel } from "../../util/UseCase";
import SpeechComponentProps from "../SpeechComponentProps"

const descriptionIntro =
  "Hallo, ich bin die Leni, ich erkläre dir kurz, was du hier machen kannst.";

interface UseCaseTemplateProps extends SpeechComponentProps{
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
  isSynthesizing
}) => {
 

  useEffect(() => {
    const intro = descriptionIntro + " " + model.description;
    synthesizeSpeech(intro);
  }, [model.description]);

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
        onClick={() => synthesizeSpeech(model.description)}
        color={isSynthesizing ? "secondary" : "primary"}
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
