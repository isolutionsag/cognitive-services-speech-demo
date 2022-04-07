import React, {useEffect, useState} from "react";
import "./App.css";
import KeysConfigForm from "./components/ConfigForm";
import Home from "./components/Home";
import {areAllConfigsValid} from "./util/ConfigValidator";
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
import {UseCaseModels} from "./util/UseCase";
import UseCaseTemplate from "./components/usecases/UseCaseTemplate";
import FourLangToSwissTranslation
    from "./components/usecases/four_lang_to_swiss_translation/FourLangToSwissTranslation";
import ChatWithBot from "./components/usecases/chat_with_bot/ChatWithBot";
import RealtimeTranscription from "./components/usecases/realtime_transcription/RealtimeTranscription";
import NewsReader from "./components/usecases/news_reader/NewsReader";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import useTextToSpeech from "./hooks/useTextToSpeech";
import {Voice} from "./util/TextToSpechVoices";
import {Routes, Route} from "react-router-dom";
import Layout from "./Layout";

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

    const {synthesizeSpeech, isSynthesizing} = useTextToSpeech(
        "",
        Voice.de_CH_LeniNeural,
        cognitiveServicesConfiguration.speechServiceConfiguration
    );

    const [useCaseError, setUseCaseError] = useState("");
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
            <Routes>
                <Route element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="translate" element={
                        <UseCaseTemplate model={UseCaseModels.fourLangToSwissTranslation} error={useCaseError}
                                         synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <FourLangToSwissTranslation
                                mySpeechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                                translatorConfig={cognitiveServicesConfiguration.translatorServiceConfiguration}
                                setError={setUseCaseError}
                                synthesizeSpeech={synthesizeSpeech}
                                isSynthesizing={isSynthesizing}
                            />
                        </UseCaseTemplate>}/>
                    <Route path="chat" element={
                        <UseCaseTemplate model={UseCaseModels.botChat} error={useCaseError}
                                         synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <ChatWithBot
                                mySpeechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                                qnaConfig={cognitiveServicesConfiguration.qnaServiceConfiguration}
                                translatorConfig={cognitiveServicesConfiguration.translatorServiceConfiguration}
                                synthesizeSpeech={synthesizeSpeech}
                                isSynthesizing={isSynthesizing}
                                setError={setUseCaseError}
                            />
                        </UseCaseTemplate>}/>
                    <Route path="transcription" element={
                        <UseCaseTemplate model={UseCaseModels.realtimeTranscription} error={useCaseError}
                                         synthesizeSpeech={synthesizeSpeech} isSynthesizing={isSynthesizing}>
                            <RealtimeTranscription
                                speechConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
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
                        speechServiceConfig={cognitiveServicesConfiguration.speechServiceConfiguration}
                        qnaConfig={cognitiveServicesConfiguration.qnaServiceConfiguration}
                        translatorConfig={cognitiveServicesConfiguration.translatorServiceConfiguration}
                        bingSearchConfig={cognitiveServicesConfiguration.bingSearchServiceConfiguration}
                        onConfigurationChanged={setCognitiveServicesConfiguration}
                    />}/>
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
