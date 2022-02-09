import React from "react";
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
import { useEffect, useRef, useState } from "react";
import useSpeechToTextContinuous from "../../../hooks/speech_to_text_continuous/useSpeechToTextContinuous";
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
import {
  ErrorReason,
  SpeechToTextContinuous,
} from "./../../../hooks/speech_to_text_continuous/SpeechToTextContinuous";

interface RealtimeTranscriptionProps extends UseCaseTemplateChildProps {
  speechConfig: MySpeechConfig;
}

const RealtimeTranscription: React.FC<RealtimeTranscriptionProps> = ({
  speechConfig,
  synthesizeSpeech,
  isSynthesizing,
  setError,
}) => {
  const speechToTextContinuousClass = useRef(
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
  const [translatingText, setTranslatingText] = useState<string>("");

  const [recognizedResults, setRecognizedResults] = useState<string[]>([]);
  const [translatedResults, setTranslatedResults] = useState<string[]>([]);

  const hasResults = recognizedResults.length + translatedResults.length > 0;

  const handleSpeechRecognitionLanguageChange = (event: SelectChangeEvent) => {
    setRecognitionLanguage(event.target.value as SpeechServiceLocale);
  };

  const handleTranslationLanguageChange = (event: SelectChangeEvent) => {
    setTranslationTargetLanguage(
      event.target.value as SpeechTranslationLanguage
    );
  };

  const handleStartRecognition = () => {
    speechToTextContinuousClass.current.startRecognition(
      recognitionLanguage,
      translationTargetLanguage
    );
    setError("");
    setIsRecognizing(true);
  };

  const handleStopRecognition = () => {
    speechToTextContinuousClass.current.stopRecognition();
    setError("");
    setIsRecognizing(false);
  };

  useEffect(() => {
    return () => {
      speechToTextContinuousClass.current.stopRecognition();
    };
  }, []);

  const clearResults = () => {
    setRecognizedResults([]);
    setTranslatedResults([]);
  };

  speechToTextContinuousClass.current.error = (error, reason) => {
    //TODO: set is recognizing false
    /*if (reason == ErrorReason.AutomaticTimeout) {
      //TODO: handle
    } else {
      setError("Error in realtime transcription: " + error);
    }*/
    setIsRecognizing(false);
    setError("Error in realtime transcription: " + error);
  };

  speechToTextContinuousClass.current.recognizing = (
    recognizing,
    translating
  ) => {
    setRecognizingText(recognizing);
    setTranslatingText(translating);
  };

  speechToTextContinuousClass.current.recognized = (recognized, translated) => {
    if (recognized && translated && recognized.length + translated.length > 0) {
      setRecognizedResults([...recognizedResults, recognized]);
      setTranslatedResults([...translatedResults, translated]);
    }
  };

  const startStopRecordingButton = () => (
    <CustomIconButton
      icon={
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
        clearResults={clearResults}
        stopRecognition={handleStopRecognition}
      />
    </div>
  );
};

export default RealtimeTranscription;
