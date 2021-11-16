import { Paper } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import KeysConfigForm from "./components/SpeechConfigForm";
import Home from "./components/Home";
import MySpeechConfig from "./models/MySpeechConfig";
import QnAConfig from "./models/QnAConfig";
import { loadSpeechConfig, saveSpeechConfig } from "./repositories/SpeechConfigRepository";
import { loadQnAConfig, saveQnAConfig } from "./repositories/QnAConfigRepository";


function App() {
  const speechConfig = loadSpeechConfig();
  const qnaConfig = loadQnAConfig();

  const handleChangeKeys = (
    mySpeechConfig: MySpeechConfig,
    qnaConfig: QnAConfig
  ) => {
    saveSpeechConfig(mySpeechConfig)
    saveQnAConfig(qnaConfig)
    setDisplaySettings(false)
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
          marginBottom: "20px"
        }}
      >
        {displaySettings ? (
          <KeysConfigForm
            hideConfigureScreen={()=> setDisplaySettings(false)}
            mySpeechConfig={speechConfig}
            qnaConfig={qnaConfig}
            setConfigKeys={handleChangeKeys}
          />
        ) : (
          <Home onDisplaySettings={() => setDisplaySettings(true)} mySpeechConfig={speechConfig} qnaConfig={qnaConfig}/>
        )}
      </Paper>
    </div>
  );
}

export default App;
