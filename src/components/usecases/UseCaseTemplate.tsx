import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import MySpeechConfig from "../../models/MySpeechConfig";
import { Voice } from "../../util/TextToSpechVoices";
import { UseCaseModel } from "../../util/UseCase";

const descriptionIntro =
  "Hallo, ich bin die Leni, ich erkläre dir kurz, was du hier machen kannst.";

interface UseCaseTemplateProps {
  model: UseCaseModel;
  speechConfig: MySpeechConfig;
}

const UseCaseTemplate: React.FC<UseCaseTemplateProps> = ({
  model,
  speechConfig,
  children,
}) => {
  const { synthesizeSpeech } = useTextToSpeech(
    "",
    Voice.de_CH_LeniNeural,
    speechConfig
  );

  useEffect(() => {
    const intro = descriptionIntro + " " + model.description;
    synthesizeSpeech(intro);
  }, []);

  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      direction="column"
    >
      <Typography variant="h3">
        {model.title}
      </Typography>
      <br />
      <Typography variant="h6">
        {model.description}
      </Typography>
      <br />
      <br />
      {children}
    </Grid>
  );
};

export default UseCaseTemplate;
