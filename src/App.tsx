import { Button, Paper } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import KeysConfigForm from "./components/ConfigForm";
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
import {
  loadBingSearchConfig,
  saveBingSearchConfig,
} from "./repositories/BingSearchConfigRepository";
import TranslatorConfig from "./models/TranslatorConfig";
import BingSearchConfig from "./models/BingSearchConfig";
import UseCase from "./util/UseCase";
import GravityItemsArea from "./components/common/GravityItemsArea";
import FourLangToSwissTranslation from "./components/usecases/FourLangToSwissTranslation";
import ChatWithBot from "./components/usecases/ChatWithBot";
import RealtimeTranscription from "./components/usecases/RealtimeTranscription";
import NewsReader from "./components/usecases/NewsReader";
import { ArrowBack, VpnKey } from "@mui/icons-material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

enum Page {
  Home,
  Settings,
  UseCase,
}

function App() {
  const speechConfig = loadSpeechConfig();
  const qnaConfig = loadQnAConfig();
  const translatorConfig = loadTranslatorConfig();
  const bingSearchConfig = loadBingSearchConfig();

  const handleChangeKeys = (
    mySpeechConfig: MySpeechConfig,
    qnaConfig: QnAConfig,
    translatorConfig: TranslatorConfig,
    bingSearchConfig: BingSearchConfig,
  ) => {
    saveSpeechConfig(mySpeechConfig);
    saveQnAConfig(qnaConfig);
    saveTranslatorConfig(translatorConfig);
    saveBingSearchConfig(bingSearchConfig);
    handleBackClick();
  };

  const [backButtonClicked, setBackButtonClicked] = useState(false);

  const [currentPage, setCurrentPage] = useState(Page.Home);
  const [prevPage, setPrevPage] = useState(Page.Home);
  const updatePage = (page: Page) => {
    setPrevPage(currentPage);
    setCurrentPage(page);
  };

  const handleBackClick = () => {
    console.log("Setting backButtonClicked to true...")
    setBackButtonClicked(true)
    console.log("backButtonClicked set to: ", backButtonClicked)
    setCurrentPage(prevPage);
  };

  const [selectedUseCase, setSelectedUseCase] = useState(UseCase.BotChat);
  const handleSelectedUseCase = (useCase: UseCase) => {
    setBackButtonClicked(false)
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

      <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                <img src="images/isolutions.svg" className="logo" alt="iSolutions" />
                <Typography variant="h6" noWrap component="div" alignSelf="center">
                  Demo App using Azure Speech Services with &nbsp;<img src="images/switzerland.svg" height="28px" alt="switzerland" />&nbsp;Language Model
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<VpnKey />}
                  onClick={() => setCurrentPage(Page.Settings)}
                >
                  Configure Keys
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Paper
          style={{
            minHeight: "60vh",
            padding: "40px",
            margin: "20px"
          }}
        >
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
              <Home useCaseSelected={handleSelectedUseCase} />
            </>
          )}
          {currentPage === Page.Settings && (
            <KeysConfigForm
              hideConfigureScreen={handleBackClick}
              mySpeechConfig={speechConfig}
              qnaConfig={qnaConfig}
              translatorConfig={translatorConfig}
              bingSearchConfig={bingSearchConfig}
              setConfigKeys={handleChangeKeys}
            />
          )}
          {currentPage === Page.UseCase && displayUseCase(selectedUseCase, backButtonClicked)}
        </Paper>

        <div className="App-footer">
          <span>created by <a href="https://www.isolutions.ch">isolutions AG</a> under MIT License.</span>
        </div>
        
      </div>
    </ThemeProvider>
  );
}

function displayUseCase(useCase: UseCase, backButtonClicked: boolean) {
  const speechConfig = loadSpeechConfig();
  const qnaConfig = loadQnAConfig();
  const translatorConfig = loadTranslatorConfig();

  console.log("Usecase selected: ", useCase);
  switch (useCase) {
    case UseCase.FourLangToSwissTranslation:
      return <FourLangToSwissTranslation mySpeechConfig={speechConfig} translatorConfig={translatorConfig}/>
    case UseCase.BotChat:
      return (
        <ChatWithBot
          mySpeechConfig={speechConfig}
          qnaConfig={qnaConfig}
          translatorConfig={translatorConfig}
        />
      );
    case UseCase.RealtimeTranscription:
return <RealtimeTranscription speechConfig={speechConfig} backButtonClicked={backButtonClicked} />;
    case UseCase.NewsReader:
      return <NewsReader speechConfig={speechConfig} />;
  }
}

export default App;
