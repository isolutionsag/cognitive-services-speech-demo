import {
  ForumOutlined,
  SettingsVoice,
  VolumeUp,
  VpnKey,
} from "@mui/icons-material";
import { IconButton, TextField, Grid, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useInput from "../hooks/useInput";
import GravityItemsArea from "./common/GravityItemsArea";
import MySpeechConfig, { isValidSpeechConfig } from "../models/MySpeechConfig";
import useSpeechToText from "../hooks/useSpeechToText";
import useTextToSpeech from "../hooks/useTextToSpeech";
import useBotResponse from "../hooks/useBotResponse";
import {makeBotRequest} from "../api/BotApi"

interface HomeProps {
  onDisplaySettings: () => void;
  mySpeechConfig: MySpeechConfig;
}

const Home: React.FC<HomeProps> = ({ onDisplaySettings, mySpeechConfig }) => {
  const useInputInput = useInput(
    "Hello, how are you?",
    () => "",
    undefined,
    false
  );

  const speechToText = useSpeechToText(mySpeechConfig);
  const _useBotResponse = useBotResponse(speechToText.resultText)
  
  const useInputOutput = useInput("", () => "", undefined, false);
  const textToSpeech = useTextToSpeech(useInputOutput.value, mySpeechConfig);

  useEffect(() => {
    useInputInput.setValue(speechToText.resultText);
  }, [speechToText.resultText]);

  useEffect(() => {
    if(_useBotResponse.isFetching) return
    useInputOutput.setValue(_useBotResponse.answer)
    textToSpeech.synthesizeSpeech(_useBotResponse.answer)
  }, [_useBotResponse.answer, _useBotResponse.isFetching])

  return (
    <>
      <GravityItemsArea right>
        <Button
          variant="outlined"
          startIcon={<VpnKey />}
          onClick={onDisplaySettings}
        >
          Configure Keys
        </Button>
      </GravityItemsArea>
      <Grid container direction="column" alignItems="center">
        <h1>Hi!</h1>
        <Typography variant="body1" gutterBottom>
          {speechToText.infoText}
        </Typography>

        <Typography variant="body2" color="orange" gutterBottom>
          {speechToText.error}
        </Typography>
        <IconButton
          size="large"
          disabled={!isValidSpeechConfig(mySpeechConfig)}
          color={
            speechToText.isRecordingAndConverting ? "secondary" : "primary"
          }
          onClick={() => speechToText.sttFromMic()}
        >
          <SettingsVoice fontSize="large"/>
        </IconButton>
        <TextField
          style={{ marginTop: "20px" }}
          multiline
          fullWidth
          name="Input"
          id="Input"
          label="Input"
          value={useInputInput.value}
          onChange={useInputInput.handleChange}
          error={useInputInput.error !== ""}
          helperText={useInputInput.error}
        />
        <div style={{ padding: "20px" }}>
          <ForumOutlined style={{ height: "50px", width: "50px" }} />
        </div>

        <TextField
          multiline
          fullWidth
          name="Bot response"
          id="Bot response"
          label="Bot response"
          value={useInputOutput.value}
          onChange={useInputOutput.handleChange}
          error={useInputOutput.error !== ""}
          helperText={useInputOutput.error}
        />

        <IconButton
          size="large"
          disabled={!isValidSpeechConfig(mySpeechConfig)}
          color={textToSpeech.isSpeaking ? "secondary" : "primary"}
          onClick={() => textToSpeech.synthesizeSpeech()}
          aria-label="Speak output"
          style={{ marginTop: "20px" }}
        >
          <VolumeUp fontSize="large"/>
        </IconButton>
      </Grid>
    </>
  );
};

export default Home;
