import { MicOff, SettingsVoice } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import useSpeechToTextContinuous from "../../../hooks/useSpeechToTextContinuous";
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

interface RealtimeTranscriptionProps extends UseCaseTemplateChildProps {
  speechConfig: MySpeechConfig;
}

const RealtimeTranscription: React.FC<RealtimeTranscriptionProps> = ({
  speechConfig,
  synthesizeSpeech,
  isSynthesizing,
  setError,
}) => {
  const speechToTextContinuous = useSpeechToTextContinuous(
    speechConfig,
    SpeechServiceLocale.German_Switzerland
  );

  const [hasResults, setHasResults] = useState(false);

  const handleSpeechRecognitionLanguageChange = (event: SelectChangeEvent) => {
    speechToTextContinuous.setRecognitionLanguage(
      event.target.value as SpeechServiceLocale
    );
  };

  const handleTranslationLanguageChange = (event: SelectChangeEvent) => {
    speechToTextContinuous.setTranslationTargetLanguage(
      event.target.value as SpeechTranslationLanguage
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => {
      speechToTextContinuous.sttFromMicStop();
    };
  }, []);

  useEffect(() => {
    if (speechToTextContinuous.error.length > 0)
      setError("Error in speech recognition: " + speechToTextContinuous.error);
    else setError("");
  }, [speechToTextContinuous.error, setError]);

  const inputLanguageSelection = () => (
    <FormControl>
      <InputLabel id="language-input-label">Eingabesprache</InputLabel>
      <Select
        disabled={hasResults}
        style={{ minWidth: "200px" }}
        autoWidth
        labelId="language-input-select-label"
        id="language-input-select"
        value={speechToTextContinuous.recognitionLanguage}
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

  const startStopRecordingButton = () => (
    <CustomIconButton
      icon={
        <Tooltip
          title={
            speechToTextContinuous.stopRecognitionBecauseTimeoutToolTip.text
          }
          open={
            speechToTextContinuous.stopRecognitionBecauseTimeoutToolTip.open
          }
          onClose={
            speechToTextContinuous.stopRecognitionBecauseTimeoutToolTip
              .handleClose
          }
        >
          <IconButton
            color="primary"
            size="large"
            onClick={
              speechToTextContinuous.isRecognizing
                ? speechToTextContinuous.sttFromMicStop
                : speechToTextContinuous.sttFromMic
            }
            disabled={isSynthesizing}
            aria-label="Speak output"
            style={{ marginTop: "20px" }}
          >
            {speechToTextContinuous.isRecognizing ? (
              <MicOff fontSize="large" />
            ) : (
              <SettingsVoice fontSize="large" />
            )}
          </IconButton>
        </Tooltip>
      }
      text={
        speechToTextContinuous.isRecognizing
          ? "Aufnahme stoppen"
          : "Aufnahme starten"
      }
    />
  );

  const outputLanguageSelection = () => (
    <FormControl>
      <InputLabel id="language-input-label">Ausgabesprache</InputLabel>
      <Select
        disabled={hasResults}
        style={{ minWidth: "200px" }}
        autoWidth
        labelId="language-select-label"
        id="language-select"
        value={speechToTextContinuous.translationTargetLanguage}
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

  return (
    <div style={{ minHeight: "65vh" }}>
      {inputLanguageSelection()}
      {startStopRecordingButton()}
      <br />
      <br />
      {outputLanguageSelection()}
      <br />
      <br />
      <br />
      <TranscriptionResults
        synthesizeSpeech={synthesizeSpeech}
        isSynthesizing={isSynthesizing}
        speechToTextContinuous={speechToTextContinuous}
        handleHasResults={setHasResults}
      />
    </div>
  );
};

export default RealtimeTranscription;
