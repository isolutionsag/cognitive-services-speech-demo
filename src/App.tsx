import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { areAllConfigsValid } from "./util/ConfigValidator";
import SpeechServiceConfiguration from "./models/SpeechServiceConfiguration";
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
import { UseCaseModels } from "./util/UseCase";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useTextToSpeech from "./hooks/useTextToSpeech";
import { Voice } from "./util/TextToSpechVoices";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { Alert, AlertTitle, CssBaseline, useMediaQuery } from "@mui/material";
import UseCaseTemplate from "./pages/usecases/UseCaseTemplate";
import TranslationPage from "./pages/usecases/translation/TranslationPage";
import QnaPage from "./pages/usecases/qna/QnaPage";
import TranscriptionPage from "./pages/usecases/transcription/TranscriptionPage";
import NewsPage from "./pages/usecases/news/NewsPage";
import Home from "./pages/HomePage";
import ConfigForm from "./pages/ConfigurationPage";

export interface ICognitiveServicesConfiguration {
    speechServiceConfiguration: SpeechServiceConfiguration;
    qnaServiceConfiguration: QnAConfig;
    translatorServiceConfiguration: TranslatorConfig;
    bingSearchServiceConfiguration: BingSearchConfig;
}

const App = () => {
    const [cognitiveServicesConfiguration, setCognitiveServicesConfiguration] = useState<ICognitiveServicesConfiguration>({
        speechServiceConfiguration: loadSpeechConfig(),
        qnaServiceConfiguration: loadQnAConfig(),
        translatorServiceConfiguration: loadTranslatorConfig(),
        bingSearchServiceConfiguration: loadBingSearchConfig()
    });
    const [validConfig, setValidConfig] = useState<boolean>(
        areAllConfigsValid(
            cognitiveServicesConfiguration.speechServiceConfiguration,
            cognitiveServicesConfiguration.qnaServiceConfiguration,
            cognitiveServicesConfiguration.translatorServiceConfiguration,
            cognitiveServicesConfiguration.bingSearchServiceConfiguration
        )
    );
    useEffect(() => {
        setValidConfig(
            areAllConfigsValid(
                cognitiveServicesConfiguration.speechServiceConfiguration,
                cognitiveServicesConfiguration.qnaServiceConfiguration,
                cognitiveServicesConfiguration.translatorServiceConfiguration,
                cognitiveServicesConfiguration.bingSearchServiceConfiguration
            )
        );
        saveSpeechConfig(cognitiveServicesConfiguration.speechServiceConfiguration);
        saveQnAConfig(cognitiveServicesConfiguration.qnaServiceConfiguration);
        saveTranslatorConfig(cognitiveServicesConfiguration.translatorServiceConfiguration);
        saveBingSearchConfig(cognitiveServicesConfiguration.bingSearchServiceConfiguration);
    }, [cognitiveServicesConfiguration]);
    const { synthesizeSpeech, isSynthesizing } = useTextToSpeech(
        "",
        Voice.de_CH_LeniNeural,
        cognitiveServicesConfiguration.speechServiceConfiguration
    );
    const [useCaseError, setUseCaseError] = useState("");
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(() => createTheme({
        palette: {
            mode: prefersDarkMode ? "dark" : "light",
        },
    }), [prefersDarkMode]);

    return (
        <ThemeProvider theme={theme}>
            {!validConfig &&
                <Alert severity="error">
                    <AlertTitle>Die Schlüssel Konfiguration ist nicht komplett.</AlertTitle>
                </Alert>
            }
            <CssBaseline />
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="translate" element={
                        <UseCaseTemplate model={UseCaseModels.fourLangToSwissTranslation} error={useCaseError}
                            synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <TranslationPage
                                speechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                                translatorConfig={cognitiveServicesConfiguration.translatorServiceConfiguration}
                                setError={setUseCaseError}
                                synthesizeSpeech={synthesizeSpeech}
                                isSynthesizing={isSynthesizing}
                            />
                        </UseCaseTemplate>} />
                    <Route path="chat" element={
                        <UseCaseTemplate model={UseCaseModels.botChat} error={useCaseError}
                            synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <QnaPage
                                speechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                                qnaConfig={cognitiveServicesConfiguration.qnaServiceConfiguration}
                                translatorConfig={cognitiveServicesConfiguration.translatorServiceConfiguration}
                                synthesizeSpeech={synthesizeSpeech}
                                isSynthesizing={isSynthesizing}
                                setError={setUseCaseError}
                            />
                        </UseCaseTemplate>} />
                    <Route path="transcription" element={
                        <UseCaseTemplate model={UseCaseModels.realtimeTranscription} error={useCaseError}
                            synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <TranscriptionPage
                                speechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                                synthesizeSpeech={synthesizeSpeech}
                                isSynthesizing={isSynthesizing}
                                setError={setUseCaseError}
                            />
                        </UseCaseTemplate>} />
                    <Route path="newsreader" element={
                        <UseCaseTemplate model={UseCaseModels.newsReader} error={useCaseError}
                            synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <NewsPage
                                synthesizeSpeech={synthesizeSpeech}
                                isSynthesizing={isSynthesizing}
                                setError={setUseCaseError}
                                speechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                                bingSearchConfig={cognitiveServicesConfiguration.bingSearchServiceConfiguration}
                            />
                        </UseCaseTemplate>} />
                    <Route path="settings" element={<ConfigForm
                        speechServiceConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                        qnaConfig={cognitiveServicesConfiguration.qnaServiceConfiguration}
                        translatorConfig={cognitiveServicesConfiguration.translatorServiceConfiguration}
                        bingSearchConfig={cognitiveServicesConfiguration.bingSearchServiceConfiguration}
                        onConfigurationChanged={setCognitiveServicesConfiguration}
                    />} />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
