import { Paper } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import KeysConfigForm from "./components/SpeechConfigForm";
import Home from "./components/Home";
import MySpeechConfig from "./models/MySpeechConfig";
import QnAConfig from "./models/QnAConfig";
import {
  loadSpeechConfig,
  saveSpeechConfig,
} from "./repositories/SpeechConfigRepository";
import {
  loadQnAConfig,
  saveQnAConfig,
} from "./repositories/QnAConfigRepository";
import {
  loadTranslatorConfig,
  saveTranslatorConfig,
} from "./repositories/TranslationConfigRepository";
import TranslatorConfig from "./models/TranslatorConfig";

function App() {
  const speechConfig = loadSpeechConfig();
  const qnaConfig = loadQnAConfig();
  const translatorConfig = loadTranslatorConfig();

  const handleChangeKeys = (
    mySpeechConfig: MySpeechConfig,
    qnaConfig: QnAConfig,
    translatorConfig: TranslatorConfig
  ) => {
    saveSpeechConfig(mySpeechConfig);
    saveQnAConfig(qnaConfig);
    saveTranslatorConfig(translatorConfig);
    setDisplaySettings(false);
  };

  const [displaySettings, setDisplaySettings] = useState(false);

  return (
    <div className="App">
      <Paper
        style={{
          minHeight: "50vh",
          maxWidth: "400px",
          padding: "40px",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {displaySettings ? (
          <KeysConfigForm
            hideConfigureScreen={() => setDisplaySettings(false)}
            mySpeechConfig={speechConfig}
            qnaConfig={qnaConfig}
            translatorConfig={translatorConfig}
            setConfigKeys={handleChangeKeys}
          />
        ) : (
          <Home
            onDisplaySettings={() => setDisplaySettings(true)}
            mySpeechConfig={speechConfig}
            qnaConfig={qnaConfig}
            translatorConfig={translatorConfig}
          />
        )}
      </Paper>
    </div>
  );
}

export default App;
