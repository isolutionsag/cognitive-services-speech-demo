import { MicOff, SettingsVoice, VolumeUp } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import useSpeechToTextContinuous from "../../hooks/useSpeechToTextContinuous";
import MySpeechConfig from "../../models/MySpeechConfig";
import { getVoiceForLanguage } from "../../util/Language";
import {
  SpeechTranslationLanguage,
  SpeechTranslationLanguagesNames,
} from "../../util/SupportedLanguages";
import { Voice } from "../../util/TextToSpechVoices";
import { originalIfNotEmptyOr } from "../../util/TextUtil";
import CustomIconButton from "../common/CustomIconButton";
import { UseCaseTemplateChildProps } from "./UseCaseTemplate";

interface RealtimeTranscriptionProps extends UseCaseTemplateChildProps {
  speechConfig: MySpeechConfig;
}

const RealtimeTranscription: React.FC<RealtimeTranscriptionProps> = ({
  speechConfig,
  synthesizeSpeech,
  isSynthesizing,
  setError,
}) => {
  const speechToTextContinuous = useSpeechToTextContinuous(speechConfig);

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

  return (
    <div style={{ minHeight: "65vh" }}>
      <Tooltip
        title={speechToTextContinuous.stopRecognitionBecauseTimeoutToolTip.text}
        open={speechToTextContinuous.stopRecognitionBecauseTimeoutToolTip.open}
        onClose={
          speechToTextContinuous.stopRecognitionBecauseTimeoutToolTip
            .handleClose
        }
      >
        <CustomIconButton
          icon={
            <IconButton
              color="primary"
              size="large"
              onClick={
                speechToTextContinuous.isRecognizing
                  ? speechToTextContinuous.sttFromMicStop
                  : speechToTextContinuous.sttFromMic
              }
              aria-label="Speak output"
              style={{ marginTop: "20px" }}
            >
              {speechToTextContinuous.isRecognizing ? (
                <MicOff fontSize="large" />
              ) : (
                <SettingsVoice fontSize="large" />
              )}
            </IconButton>
          }
          text={
            speechToTextContinuous.isRecognizing
              ? "Aufnahme stoppen"
              : "Aufnahme starten"
          }
        />
      </Tooltip>
      <br />
      <FormControl>
        <InputLabel id="language-input-label">Ausgabesprache</InputLabel>
        <Select
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
      <br />
      <br />
      <br />
      <Typography variant="subtitle1">Erkannte Wörter</Typography>
      <Box
        border="1px solid black"
        borderRadius="5px"
        padding="10px"
        minWidth="800px"
      >
        <Typography variant="h6">
          {originalIfNotEmptyOr(
            speechToTextContinuous.recognizingText,
            "Klicke den Aufnehme Knopf und sag etwas..."
          )}
        </Typography>
        <Typography variant="h6" color="primary">
          {originalIfNotEmptyOr(speechToTextContinuous.translatingText, "...")}
        </Typography>
      </Box>
      <br />
      <Typography variant="subtitle1">Erkannte Sätze (nach Pause)</Typography>
      <Box
        border="1px solid black"
        borderRadius="5px"
        padding="10px"
        minWidth="800px"
      >
        <Typography variant="h5">
          {originalIfNotEmptyOr(speechToTextContinuous.recognizedText, "...")}
        </Typography>
        <Typography variant="h5" color="primary">
          {originalIfNotEmptyOr(speechToTextContinuous.translatedText, "...")}
        </Typography>
        <br />
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Button
              onClick={() =>
                synthesizeSpeech(
                  speechToTextContinuous.recognizedText,
                  Voice.de_CH_LeniNeural
                )
              }
              disabled={speechToTextContinuous.recognizedText.length < 1}
              color={isSynthesizing ? "secondary" : "primary"}
              variant="outlined"
              startIcon={<VolumeUp />}
            >
              Auf Schweizerdeutsch wiedergeben
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                const voice = getVoiceForLanguage(
                  speechToTextContinuous.translationTargetLanguage
                );
                synthesizeSpeech(speechToTextContinuous.translatedText, voice);
              }}
              disabled={
                !speechToTextContinuous.translatedText ||
                speechToTextContinuous.translatedText?.length < 1
              }
              color={isSynthesizing ? "secondary" : "primary"}
              variant="outlined"
              startIcon={<VolumeUp />}
            >
              {`Auf ${
                SpeechTranslationLanguagesNames[
                  speechToTextContinuous.translationTargetLanguage
                ]
              } wiedergeben`}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default RealtimeTranscription;
