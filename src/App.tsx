import {Alert, Button, Paper} from "@mui/material";
import React, {useState} from "react";
import "./App.css";
import KeysConfigForm from "./components/ConfigForm";
import Home from "./components/Home";
import {areAllConfigsValid} from "./util/ConfigValidator";
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
import {UseCaseModels} from "./util/UseCase";
import GravityItemsArea from "./components/common/GravityItemsArea";
import UseCaseTemplate from "./components/usecases/UseCaseTemplate";
import FourLangToSwissTranslation
    from "./components/usecases/four_lang_to_swiss_translation/FourLangToSwissTranslation";
import ChatWithBot from "./components/usecases/chat_with_bot/ChatWithBot";
import RealtimeTranscription from "./components/usecases/realtime_transcription/RealtimeTranscription";
import NewsReader from "./components/usecases/news_reader/NewsReader";
import {ArrowBack, VpnKey} from "@mui/icons-material";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useTextToSpeech from "./hooks/useTextToSpeech";
import {Voice} from "./util/TextToSpechVoices";
import {Routes, Route, Link as RouterLink} from "react-router-dom";


enum Page {
    Home,
    Settings,
    UseCase,
}

const App = () => {
    // TODO: Fix this
    let speechConfig = loadSpeechConfig();
    let qnaConfig = loadQnAConfig();
    let translatorConfig = loadTranslatorConfig();
    let bingSearchConfig = loadBingSearchConfig();

    const [validConfig, setValidConfig] = useState(
        areAllConfigsValid(
            speechConfig,
            qnaConfig,
            translatorConfig,
            bingSearchConfig
        )
    );

    function loadConfigs() {
        speechConfig = loadSpeechConfig();
        qnaConfig = loadQnAConfig();
        translatorConfig = loadTranslatorConfig();
        bingSearchConfig = loadBingSearchConfig();
        setValidConfig(
            areAllConfigsValid(
                speechConfig,
                qnaConfig,
                translatorConfig,
                bingSearchConfig
            )
        );
    }

    const {synthesizeSpeech, isSynthesizing} = useTextToSpeech(
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

        loadConfigs();

        handleBackClick();
    };

    const [useCaseError, setUseCaseError] = useState("");

    const [currentPage, setCurrentPage] = useState(Page.Home);
    const [prevPage, setPrevPage] = useState(Page.Home);

    const handleBackClick = () => {
        setCurrentPage(prevPage);
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
                            <Box sx={{flexGrow: 1, display: {xs: "flex", md: "flex"}}}>
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
                                    Demo App mit Verwendung der Azure Speech Services mit &nbsp;
                                    <img
                                        src="images/switzerland.svg"
                                        height="28px"
                                        alt="switzerland"
                                    />
                                    &nbsp;Sprachenmodel
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    startIcon={<VpnKey/>}
                                    component={RouterLink}
                                    to="settings"
                                >
                                    Schlüssel konfigurieren
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
                                startIcon={<ArrowBack/>}
                            >
                                Home
                            </Button>
                        </GravityItemsArea>
                    )}
                    {!validConfig && currentPage !== Page.Settings && (
                        <Alert
                            style={{marginTop: "20px"}}
                            severity="warning"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={() => setCurrentPage(Page.Settings)}
                                >
                                    Schlüssel konfigurieren
                                </Button>
                            }
                        >
                            One or more config keys are not entered yet
                        </Alert>
                    )}
                    <Routes>
                        <Route path="" element={<Home/>}/>
                        <Route path="translate" element={
                            <UseCaseTemplate model={UseCaseModels.fourLangToSwissTranslation} error={useCaseError}
                                             synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                                <FourLangToSwissTranslation
                                    mySpeechConfig={speechConfig}
                                    translatorConfig={translatorConfig}
                                    setError={setUseCaseError}
                                    synthesizeSpeech={synthesizeSpeech}
                                    isSynthesizing={isSynthesizing}
                                />
                            </UseCaseTemplate>}/>
                        <Route path="chat" element={
                            <UseCaseTemplate model={UseCaseModels.botChat} error={useCaseError}
                                             synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                                <ChatWithBot
                                    mySpeechConfig={speechConfig}
                                    qnaConfig={qnaConfig}
                                    translatorConfig={translatorConfig}
                                    synthesizeSpeech={synthesizeSpeech}
                                    isSynthesizing={isSynthesizing}
                                    setError={setUseCaseError}
                                />
                            </UseCaseTemplate>}/>
                        <Route path="transcription" element={
                            <UseCaseTemplate model={UseCaseModels.realtimeTranscription} error={useCaseError}
                                             synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                                <RealtimeTranscription
                                    speechConfig={speechConfig}
                                    synthesizeSpeech={synthesizeSpeech}
                                    isSynthesizing={isSynthesizing}
                                    setError={setUseCaseError}
                                />
                            </UseCaseTemplate>}/>
                        <Route path="newsreader" element={
                            <UseCaseTemplate model={UseCaseModels.newsReader} error={useCaseError}
                                             synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                                <NewsReader
                                    synthesizeSpeech={synthesizeSpeech}
                                    isSynthesizing={isSynthesizing}
                                    setError={setUseCaseError}
                                />
                            </UseCaseTemplate>}/>
                        <Route path="settings" element={<KeysConfigForm
                            hideConfigureScreen={handleBackClick}
                            mySpeechConfig={speechConfig}
                            qnaConfig={qnaConfig}
                            translatorConfig={translatorConfig}
                            bingSearchConfig={bingSearchConfig}
                            setConfigKeys={handleChangeKeys}
                        />}/>
                    </Routes>
                </Paper>
                <div className="App-footer" style={{paddingBottom: "20px"}}>
                  <span>
                    created by <a href="https://www.isolutions.ch" target="_blank" rel="noreferrer">isolutions AG</a>
                  </span>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
