import { Button, Grid, IconButton, Paper, TextField } from "@mui/material";
import React from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import useInput from "../hooks/useInput";
import { ArrowBack, Save } from "@mui/icons-material";
import GravityItemsArea from "./common/GravityItemsArea";

interface SpeechConfigFormProps {
  hideConfigureScreen: () => void;
  config: MySpeechConfig;
  setConfig: (config: MySpeechConfig) => void;
}

const SpeechConfigForm: React.FC<SpeechConfigFormProps> = ({
  hideConfigureScreen,
  config: connectionStrings,
  setConfig: setConnectionStrings,
}) => {
  const useInputResourceKey = useInput(
    connectionStrings.resourceKey,
    () => "",
    undefined,
    false
  );

  const useInputRegion = useInput(
    connectionStrings.region,
    () => "",
    undefined,
    false
  );

  const handleSaveKeys = () => {
    useInputResourceKey.validate();
    if (useInputResourceKey.isValid && useInputRegion.isValid) {
      connectionStrings.resourceKey = useInputResourceKey.value;
      connectionStrings.region = useInputRegion.value;
      setConnectionStrings(connectionStrings);
    }
  };

  return (
    <>
      <GravityItemsArea>
        <IconButton onClick={hideConfigureScreen}>
          <ArrowBack />
        </IconButton>
      </GravityItemsArea>
      <Grid>
        <h1>Configure keys for speech service</h1>
        <TextField
          fullWidth
          label="Resource key"
          value={useInputResourceKey.value}
          onChange={useInputResourceKey.handleChange}
          helperText={useInputResourceKey.error}
          error={useInputResourceKey.error !== ""}
        />
        <TextField
          style={{ marginTop: "20px" }}
          fullWidth
          label="Region"
          value={useInputRegion.value}
          onChange={useInputRegion.handleChange}
          helperText={useInputRegion.error}
          error={useInputRegion.error !== ""}
        />
        <div>
          <Button
            style={{ marginTop: "20px" }}
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveKeys}
          >
            Save and close
          </Button>
        </div>
      </Grid>
    </>
  );
};

export default SpeechConfigForm;
