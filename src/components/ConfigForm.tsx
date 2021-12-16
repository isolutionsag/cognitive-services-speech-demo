import { Box, Button, Grid, IconButton, Paper, TextField } from "@mui/material";
import React from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import useInput from "../hooks/useInput";
import { ArrowBack, Save } from "@mui/icons-material";
import GravityItemsArea from "./common/GravityItemsArea";
import QnAConfig from "../models/QnAConfig";
import TranslatorConfig from "../models/TranslatorConfig";
import BingSearchConfig from "../models/BingSearchConfig";

interface ConfigFormProps {
  hideConfigureScreen: () => void;
  mySpeechConfig: MySpeechConfig;
  qnaConfig: QnAConfig;
  translatorConfig: TranslatorConfig;
  bingSearchConfig: BingSearchConfig;
  setConfigKeys: (
    mySpeechConfig: MySpeechConfig,
    qnaConfig: QnAConfig,
    translatorConfig: TranslatorConfig,
    bingSearchConfig: BingSearchConfig
  ) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  hideConfigureScreen,
  mySpeechConfig,
  qnaConfig,
  translatorConfig,
  bingSearchConfig,
  setConfigKeys,
}) => {
  const useInputResourceKey = useInput(mySpeechConfig.resourceKey);
  const useInputRegion = useInput(mySpeechConfig.region);

  const useInputKbId = useInput(qnaConfig.knowledgeBaseId);
  const useInputAuthEndpointKey = useInput(qnaConfig.authEndpointKey);
  const useInputBotName = useInput(qnaConfig.botName);

  const useInputTranslatorSubscriptionKey = useInput(
    translatorConfig.subscriptionKey
  );

  const useInputBingSearchSubscriptionKey = useInput(
    bingSearchConfig.subscriptionKey
  );

  const handleSaveKeys = () => {
    mySpeechConfig.resourceKey = useInputResourceKey.value;
    mySpeechConfig.region = useInputRegion.value;

    qnaConfig.knowledgeBaseId = useInputKbId.value;
    qnaConfig.authEndpointKey = useInputAuthEndpointKey.value;
    qnaConfig.botName = useInputBotName.value;

    translatorConfig.subscriptionKey = useInputTranslatorSubscriptionKey.value;

    bingSearchConfig.subscriptionKey = useInputBingSearchSubscriptionKey.value;

    setConfigKeys(
      mySpeechConfig,
      qnaConfig,
      translatorConfig,
      bingSearchConfig
    );
  };

  const sectionBoxStyles = { border: 1, p: 3, borderRadius: "4px" };
  const textFieldStyles = { marginTop: "20px" };
  return (
    <Grid container justifyContent="center">
      <Grid item style={{ maxWidth: "500px" }}>
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
          <h3>Translator</h3>
          <Box sx={sectionBoxStyles}>
            <TextField
              fullWidth
              label="Subscription (Resource) Key"
              value={useInputTranslatorSubscriptionKey.value}
              onChange={useInputTranslatorSubscriptionKey.handleChange}
            />
          </Box>
          <h3>Bing Search</h3>
          <Box sx={sectionBoxStyles}>
            <TextField
              fullWidth
              label="Subscription (Resource) Key"
              value={useInputBingSearchSubscriptionKey.value}
              onChange={useInputBingSearchSubscriptionKey.handleChange}
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
    </Grid>
  );
};

export default ConfigForm;
