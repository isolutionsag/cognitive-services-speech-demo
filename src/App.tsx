import { Paper } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import SpeechConfigForm from "./components/SpeechConfigForm";
import Home from "./components/Home";
import MySpeechConfig from "./models/MySpeechConfig";
import { loadSpeechConfig, saveSpeechConfig } from "./repositories/SpeechConfigRepository";


function App() {
  const speechConfig = loadSpeechConfig();
  const handleChangeSpeechConfig = (
    connectionStrings: MySpeechConfig
  ) => {
    saveSpeechConfig(connectionStrings)
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
          <SpeechConfigForm
            hideConfigureScreen={()=> setDisplaySettings(false)}
            config={speechConfig}
            setConfig={handleChangeSpeechConfig}
          />
        ) : (
          <Home onDisplaySettings={() => setDisplaySettings(true)} mySpeechConfig={speechConfig}/>
        )}
      </Paper>
    </div>
  );
}

export default App;
