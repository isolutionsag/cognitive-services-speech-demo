import { Button, Paper } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import KeysConfigForm from "./components/SpeechConfigForm";
import Home from "./components/Home";
import PaperArea from "./components/common/PaperArea";
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
import UseCase from "./util/UseCase";
import GravityItemsArea from "./components/common/GravityItemsArea";
import ChatWithBot from "./components/usecases/ChatWithBot";
import RealtimeTranscription from "./components/usecases/RealtimeTranscription";
import { ArrowBack, VpnKey } from "@mui/icons-material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

enum Page {
  Home,
  Settings,
  UseCase,
}

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
    handleBackClick();
  };

  const [currentPage, setCurrentPage] = useState(Page.Home);
  const [prevPage, setPrevPage] = useState(Page.Home);
  const updatePage = (page: Page) => {
    setPrevPage(currentPage);
    setCurrentPage(page);
  };

  const handleBackClick = () => {
    setCurrentPage(prevPage);
  };

  const [selectedUseCase, setSelectedUseCase] = useState(UseCase.BotChat);
  const handleSelectedUseCase = (useCase: UseCase) => {
    updatePage(Page.UseCase);
    setSelectedUseCase(useCase);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#003854',
      },
      secondary: {
        main: '#E83181'
      },
      background: {
        default: '#d4dce1'
      }
    }
  }); 

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <div className="App-header">
        <img src="images/isolutions.svg" className="logo" alt="iSolutions" />
        <h1>Demo App using Azure Speech Services - <img src="images/switzerland.svg" height="28px" alt="switzerland" /> Language Model</h1>
      </div>

      <PaperArea maxWidth={currentPage===Page.Home? 800: 400}>
        {currentPage !== Page.Home && (
          <GravityItemsArea>
            <Button
              onClick={handleBackClick}
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBack />}
            >
              Home
            </Button>
          </GravityItemsArea>
        )}
        {currentPage === Page.Home && (
          <>
            <GravityItemsArea right>
              <Button
                variant="outlined"
                startIcon={<VpnKey />}
                onClick={() => setCurrentPage(Page.Settings)}
              >
                Configure Keys
              </Button>
            </GravityItemsArea>
            <Home useCaseSelected={handleSelectedUseCase} />
          </>
        )}
        {currentPage === Page.Settings && (
          <KeysConfigForm
            hideConfigureScreen={handleBackClick}
            mySpeechConfig={speechConfig}
            qnaConfig={qnaConfig}
            translatorConfig={translatorConfig}
            setConfigKeys={handleChangeKeys}
          />
        )}
        {currentPage === Page.UseCase &&  displayUseCase(selectedUseCase)}
      </PaperArea>
      <div className="App-footer">
        <span>created by <a href="https://www.isolutions.ch">isolutions AG</a> under MIT License.</span>
      </div>
    </div>
    </ThemeProvider>
  );
}

function displayUseCase(useCase: UseCase) {
  const speechConfig = loadSpeechConfig();
  const qnaConfig = loadQnAConfig();
  const translatorConfig = loadTranslatorConfig();

  console.log("Usecase selected: ", useCase);
  switch (useCase) {
    case UseCase.BotChat:
      return (
        <ChatWithBot
          mySpeechConfig={speechConfig}
          qnaConfig={qnaConfig}
          translatorConfig={translatorConfig}
        />
      );
    case UseCase.RealtimeTranscription:
      return <RealtimeTranscription speechConfig={speechConfig} />;
      break;
  }
}

export default App;
