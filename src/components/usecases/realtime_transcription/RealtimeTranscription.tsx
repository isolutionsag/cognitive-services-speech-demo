import React, { useRef, useState, useEffect } from "react";
import { MicOff, SettingsVoice, ArrowForward } from "@mui/icons-material";
import {
  FormControl,
  Box,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import MySpeechConfig from "../../../models/MySpeechConfig";
import {
  SpeechServiceLanguagesNames,
  SpeechServiceLocale,
  SpeechTranslationLanguage,
  SpeechTranslationLanguagesNames,
} from "../../../util/SupportedLanguages";
import CustomIconButton from "../../common/CustomIconButton";
import { UseCaseTemplateChildProps } from "../UseCaseTemplate";
import TranscriptionResults from "./TranscriptionResults";
import { SpeechToTextContinuous } from "./../../../hooks/speech_to_text_continuous/SpeechToTextContinuous";
import { useDebounce, useDebouncedValue, useDidUpdate } from "rooks";
import useTooltip from "../../../hooks/useTooltip";

const autoStopRecognitionTimeout = 3 * 1000; //millis

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

interface RealtimeTranscriptionProps extends UseCaseTemplateChildProps {
  speechConfig: MySpeechConfig;
}

const RealtimeTranscription: React.FC<RealtimeTranscriptionProps> = ({
  speechConfig,
  synthesizeSpeech,
  isSynthesizing,
  setError,
}) => {
  const speechToTextContinuous = useRef(
    new SpeechToTextContinuous(speechConfig)
  );

  const [isRecognizing, setIsRecognizing] = useState(false);

  const [recognitionLanguage, setRecognitionLanguage] = useState(
    SpeechServiceLocale.German_Switzerland
  );
  const [translationTargetLanguage, setTranslationTargetLanguage] = useState(
    SpeechTranslationLanguage.English
  );

  const [recognizingText, setRecognizingText] = useState("");
  const [translatingText, setTranslatingText] = useState("");

  const [recognizedResults, setRecognizedResults] = useState<string[]>([]);
  const [translatedResults, setTranslatedResults] = useState<string[]>([]);

  const stopRecognitionBecauseTimeoutToolTip = useTooltip(
    `Aufnahme gestoppt, wegen Inaktivität für ${
      autoStopRecognitionTimeout / 1000
    } Sek`
  );

  const handleStartRecognition = () => {
    speechToTextContinuous.current.startRecognition(
      recognitionLanguage,
      translationTargetLanguage
    );
    setError("");
    setIsRecognizing(true);
    resetTimeout.current();
  };

  const handleStopRecognition = () => {
    speechToTextContinuous.current.stopRecognition();
    setError("");
    setIsRecognizing(false);
  };

  const handleTimeout = () => {
    if (!isRecognizing) return;
    handleStopRecognition();
    stopRecognitionBecauseTimeoutToolTip.handleOpen();
  };

  const resetTimeout = useRef(
    debounce(handleTimeout, autoStopRecognitionTimeout)
  );

  const hasResults = recognizedResults.length + translatedResults.length > 0;

  const handleSpeechRecognitionLanguageChange = (event: SelectChangeEvent) => {
    setRecognitionLanguage(event.target.value as SpeechServiceLocale);
  };

  const handleTranslationLanguageChange = (event: SelectChangeEvent) => {
    setTranslationTargetLanguage(
      event.target.value as SpeechTranslationLanguage
    );
  };

  useEffect(() => {
    return () => {
      speechToTextContinuous.current.closeRecognizer();
    };
  }, []);

  const clearResults = () => {
    setRecognizedResults([]);
    setTranslatedResults([]);
  };

  speechToTextContinuous.current.error = (error, reason) => {
    setIsRecognizing(false);
    setError("Error in realtime transcription: " + error);
  };

  speechToTextContinuous.current.recognizing = (recognizing, translating) => {
    setRecognizingText(recognizing);
    setTranslatingText(translating);
    resetTimeout.current();
  };

  speechToTextContinuous.current.recognized = (recognized, translated) => {
    setRecognizingText("");
    setTranslatingText("");
    if (recognized && translated && recognized.length + translated.length > 0) {
      setRecognizedResults([...recognizedResults, recognized]);
      setTranslatedResults([...translatedResults, translated]);
    }
  };

  const startStopRecordingButton = () => (
    <CustomIconButton
      icon={
        <Tooltip
          title={stopRecognitionBecauseTimeoutToolTip.text}
          open={stopRecognitionBecauseTimeoutToolTip.open}
          onClose={stopRecognitionBecauseTimeoutToolTip.handleClose}
        >
          <IconButton
            color="primary"
            size="large"
            onClick={
              isRecognizing ? handleStopRecognition : handleStartRecognition
            }
            disabled={isSynthesizing}
            aria-label="Speak output"
            style={{ marginTop: "20px" }}
          >
            {isRecognizing ? (
              <MicOff fontSize="large" />
            ) : (
              <SettingsVoice fontSize="large" />
            )}
          </IconButton>
        </Tooltip>
      }
      text={isRecognizing ? "Aufnahme stoppen" : "Aufnahme starten"}
    />
  );

  const inputLanguageSelection = () => {
    if (hasResults || isRecognizing)
      return (
        <Typography variant="h6">
          {SpeechServiceLanguagesNames[recognitionLanguage]}
        </Typography>
      );
    return (
      <FormControl>
        <InputLabel id="language-input-label">Eingabesprache</InputLabel>
        <Select
          disabled={hasResults}
          style={{ minWidth: "200px" }}
          autoWidth
          labelId="language-input-select-label"
          id="language-input-select"
          value={recognitionLanguage}
          label="Ausgabesprache"
          onChange={handleSpeechRecognitionLanguageChange}
        >
          {Object.values(SpeechServiceLocale).map((language) => (
            <MenuItem value={language} key={language}>
              {SpeechServiceLanguagesNames[language]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const outputLanguageSelection = () => {
    if (hasResults || isRecognizing)
      return (
        <Typography variant="h6" color="primary">
          {SpeechTranslationLanguagesNames[translationTargetLanguage]}
        </Typography>
      );
    return (
      <FormControl>
        <InputLabel id="language-input-label">Ausgabesprache</InputLabel>
        <Select
          disabled={hasResults}
          style={{ minWidth: "200px" }}
          autoWidth
          labelId="language-select-label"
          id="language-select"
          value={translationTargetLanguage}
          label="Ausgabesprache"
          onChange={handleTranslationLanguageChange}
        >
          {Object.values(SpeechTranslationLanguage).map((language) => (
            <MenuItem value={language} key={language}>
              {SpeechTranslationLanguagesNames[language]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div style={{ minHeight: "65vh" }}>
      <Box sx={{ margin: ".5rem 0" }}>{startStopRecordingButton()}</Box>
      <Box sx={{ margin: "1rem 0" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {inputLanguageSelection()}
          <ArrowForward sx={{ width: 32, height: 32 }} />
          {outputLanguageSelection()}
        </Box>
        {(hasResults || isRecognizing) && (
          <Typography variant="body2" color="GrayText">
            Um die Sprachen zu wechseln, beende die Aufnahme und räume alle
            Aufnahmen auf.
          </Typography>
        )}
      </Box>

      <TranscriptionResults
        synthesizeSpeech={synthesizeSpeech}
        isSynthesizing={isSynthesizing}
        recognitionLanguage={recognitionLanguage}
        translationTargetLanguage={translationTargetLanguage}
        recognizedResults={recognizedResults}
        translatedResults={translatedResults}
        recognizingText={recognizingText}
        translatingText={translatingText}
        clearResults={clearResults}
        stopRecognition={handleStopRecognition}
      />
    </div>
  );
};

export default RealtimeTranscription;
