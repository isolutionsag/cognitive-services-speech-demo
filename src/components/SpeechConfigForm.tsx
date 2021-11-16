import { Box, Button, Grid, IconButton, Paper, TextField } from "@mui/material";
import React from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import useInput from "../hooks/useInput";
import { ArrowBack, Save } from "@mui/icons-material";
import GravityItemsArea from "./common/GravityItemsArea";
import QnAConfig from "../models/QnAConfig";

interface SpeechConfigFormProps {
  hideConfigureScreen: () => void;
  mySpeechConfig: MySpeechConfig;
  qnaConfig: QnAConfig;
  setConfigKeys: (mySpeechConfig: MySpeechConfig, qnaConfig: QnAConfig) => void;
}

const SpeechConfigForm: React.FC<SpeechConfigFormProps> = ({
  hideConfigureScreen,
  mySpeechConfig,
  qnaConfig,
  setConfigKeys,
}) => {
  const useInputResourceKey = useInput(mySpeechConfig.resourceKey);
  const useInputRegion = useInput(mySpeechConfig.region);

  const useInputKbId = useInput(qnaConfig.knowledgeBaseId);
  const useInputAuthEndpointKey = useInput(qnaConfig.authEndpointKey);
  const useInputBotName = useInput(qnaConfig.botName);

  const handleSaveKeys = () => {
    mySpeechConfig.resourceKey = useInputResourceKey.value;
    mySpeechConfig.region = useInputRegion.value;

    qnaConfig.knowledgeBaseId = useInputKbId.value;
    qnaConfig.authEndpointKey = useInputAuthEndpointKey.value;
    qnaConfig.botName = useInputBotName.value;
    setConfigKeys(mySpeechConfig, qnaConfig);
  };

  const sectionBoxStyles = { border: 1, p: 3, borderRadius: "4px" };
  const textFieldStyles = { marginTop: "20px" };
  return (
    <>
      <GravityItemsArea>
        <IconButton onClick={hideConfigureScreen}>
          <ArrowBack />
        </IconButton>
      </GravityItemsArea>
      <Grid>
        <h1>Configure keys</h1>
        <Box sx={{ textAlign: "left" }}>
          <h3>Speech service</h3>
          <Box sx={sectionBoxStyles}>
            <TextField
              fullWidth
              label="Resource key"
              value={useInputResourceKey.value}
              onChange={useInputResourceKey.handleChange}
            />
            <TextField
              style={textFieldStyles}
              fullWidth
              label="Region"
              value={useInputRegion.value}
              onChange={useInputRegion.handleChange}
            />
          </Box>
          <h3>QnAMaker</h3>
          <Box sx={sectionBoxStyles}>
            <TextField
              fullWidth
              label="KB (Knowledge Base) Id"
              value={useInputKbId.value}
              onChange={useInputKbId.handleChange}
            />
            <TextField
              style={textFieldStyles}
              fullWidth
              label="AuthEndpoint Key"
              value={useInputAuthEndpointKey.value}
              onChange={useInputAuthEndpointKey.handleChange}
            />
            <TextField
              style={textFieldStyles}
              fullWidth
              label="Bot Name"
              value={useInputBotName.value}
              onChange={useInputBotName.handleChange}
            />
          </Box>
        </Box>

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
