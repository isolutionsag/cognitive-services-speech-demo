import { Alert, Button, Paper } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import KeysConfigForm from "./components/ConfigForm";
import Home from "./components/Home";
import { areAllConfigsValid } from "./util/ConfigValidator";
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
import UseCase, { UseCaseModels } from "./util/UseCase";
import GravityItemsArea from "./components/common/GravityItemsArea";
import UseCaseTemplate from "./components/usecases/UseCaseTemplate";
import FourLangToSwissTranslation from "./components/usecases/FourLangToSwissTranslation";
import ChatWithBot from "./components/usecases/ChatWithBot";
import RealtimeTranscription from "./components/usecases/RealtimeTranscription";
import NewsReader from "./components/usecases/NewsReader";
import { ArrowBack, VpnKey } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useTextToSpeech from "./hooks/useTextToSpeech";
import { Voice } from "./util/TextToSpechVoices";

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

  const [validConfig] = useState(
    areAllConfigsValid(
      speechConfig,
      qnaConfig,
      translatorConfig,
      bingSearchConfig
    )
  );

  const { synthesizeSpeech, isSynthesizing } = useTextToSpeech(
    "",
    Voice.de_CH_LeniNeural,
    speechConfig
  );

  const handleChangeKeys = (
    mySpeechConfig: MySpeechConfig,
    qnaConfig: QnAConfig,
    translatorConfig: TranslatorConfig,
    bingSearchConfig: BingSearchConfig
  ) => {
    saveSpeechConfig(mySpeechConfig);
    saveQnAConfig(qnaConfig);
    saveTranslatorConfig(translatorConfig);
    saveBingSearchConfig(bingSearchConfig);

    handleBackClick();
  };

  const [useCaseError, setUseCaseError] = useState("");

  const [currentPage, setCurrentPage] = useState(Page.Home);
  const [prevPage, setPrevPage] = useState(Page.Home);
  const updatePage = (page: Page) => {
    setPrevPage(currentPage);
    setCurrentPage(page);
    setUseCaseError("");
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
        main: "#003854",
      },
      secondary: {
        main: "#E83181",
      },
      background: {
        default: "#d4dce1",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
                <img
                  src="images/isolutions.svg"
                  className="logo"
                  alt="iSolutions"
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  alignSelf="center"
                >
                  Demo App using Azure Speech Services with &nbsp;
                  <img
                    src="images/switzerland.svg"
                    height="28px"
                    alt="switzerland"
                  />
                  &nbsp;Language Model
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
            margin: "20px",
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
          {!validConfig && currentPage !== Page.Settings && (
            <Alert
              style={{ marginTop: "20px" }}
              severity="warning"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setCurrentPage(Page.Settings)}
                >
                  Configure Keys
                </Button>
              }
            >
              One or more config keys are not entered yet
            </Alert>
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
          {currentPage === Page.UseCase &&
            displayUseCase(selectedUseCase, useCaseError, setUseCaseError, synthesizeSpeech, isSynthesizing)}
        </Paper>

        <div className="App-footer" style={{paddingBottom: "20px"}}>
          <span>
            created by <a href="https://www.isolutions.ch">isolutions AG</a>
          </span>
        </div>
      </div>
    </ThemeProvider>
  );
}

function displayUseCase(
  useCase: UseCase,
  useCaseError: string,
  setUseCaseError: React.Dispatch<React.SetStateAction<string>>,
  synthesizeSpeech: (text?: string, voice?: Voice) => void,
  isSynthesizing: boolean
) {
  const speechConfig = loadSpeechConfig();

  return (
    <UseCaseTemplate
      model={UseCaseModels[useCase]}
      error={useCaseError}
      synthesizeSpeech={synthesizeSpeech}
      isSynthesizing={isSynthesizing}
    >
      {getUseCaseContent(
        useCase,
        speechConfig,
        setUseCaseError,
        synthesizeSpeech,
        isSynthesizing
      )}
    </UseCaseTemplate>
  );
}

function getUseCaseContent(
  useCase: UseCase,
  speechConfig: MySpeechConfig,
  setError: React.Dispatch<React.SetStateAction<string>>,
  synthesizeSpeech: (text?: string, voice?: Voice) => void,
  isSynthesizing: boolean
) {
  const qnaConfig = loadQnAConfig();
  const translatorConfig = loadTranslatorConfig();

  switch (useCase) {
    case UseCase.FourLangToSwissTranslation:
      return (
        <FourLangToSwissTranslation
          mySpeechConfig={speechConfig}
          translatorConfig={translatorConfig}
          setError={setError}
          synthesizeSpeech={synthesizeSpeech}
          isSynthesizing={isSynthesizing}
        />
      );
    case UseCase.BotChat:
      return (
        <ChatWithBot
          mySpeechConfig={speechConfig}
          qnaConfig={qnaConfig}
          translatorConfig={translatorConfig}
          synthesizeSpeech={synthesizeSpeech}
          isSynthesizing={isSynthesizing}
          setError={setError}
        />
      );
    case UseCase.RealtimeTranscription:
      return (
        <RealtimeTranscription
          speechConfig={speechConfig}
          synthesizeSpeech={synthesizeSpeech}
          isSynthesizing={isSynthesizing}
          setError={setError}
        />
      );
    case UseCase.NewsReader:
      return (
        <NewsReader
          synthesizeSpeech={synthesizeSpeech}
          isSynthesizing={isSynthesizing}
          setError={setError}
        />
      );
  }
}

export default App;
