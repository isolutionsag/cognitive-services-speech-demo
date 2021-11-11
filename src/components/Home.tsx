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
import MySpeechConfig from "../models/MySpeechConfig";
import useSpeechToText from "../hooks/useSpeechToText";

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

  const useInputOutput = useInput("Hi, I'm fine!", () => "", undefined, false);
  const useSpeechSdk_ = useSpeechToText(mySpeechConfig);

  useEffect(() => {
    useInputInput.setValue(useSpeechSdk_.resultText);
  }, [useSpeechSdk_.resultText]);

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
          {useSpeechSdk_.infoText}
        </Typography>

        <Typography variant="body2" color="orange" gutterBottom>
          {useSpeechSdk_.error}
        </Typography>
        <IconButton
        enabled={useSpeechSdk_.success}
          color={
            useSpeechSdk_.isRecordingAndConverting ? "secondary" : "primary"
          }
          onClick={() => useSpeechSdk_.sttFromMic()}
        >
          <SettingsVoice />
        </IconButton>
        <TextField
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
          color="primary"
          aria-label="Speak output"
          style={{ marginTop: "20px" }}
        >
          <VolumeUp />
        </IconButton>
      </Grid>
    </>
  );
};

export default Home;
