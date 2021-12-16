import { VolumeUp } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import useSpeechToTextContinuous from "../../hooks/useSpeechToTextContinuous";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import MySpeechConfig from "../../models/MySpeechConfig";
import {
  SpeechTranslationLanguage,
  SpeechTranslationLanguagesNames,
} from "../../util/SupportedLanguages";
import { Voice } from "../../util/TextToSpechVoices";

interface RealtimeTranscriptionProps {
  speechConfig: MySpeechConfig;
}

const RealtimeTranscription: React.FC<RealtimeTranscriptionProps> = ({
  speechConfig,
}) => {
  const speechToTextContinuous = useSpeechToTextContinuous(speechConfig);
  const { synthesizeSpeech, isSynthesizing } = useTextToSpeech(
    "",
    Voice.de_CH_LeniNeural,
    speechConfig
  );

  const handleTranslationLanguageChange = (event: SelectChangeEvent) => {
    speechToTextContinuous.setTranslationTargetLanguage(
      event.target.value as SpeechTranslationLanguage
    );
  };

  useEffect(() => {
    return () => {
      console.log("Cleanup transcription component");
      speechToTextContinuous.sttFromMicStop();
    };
  }, []);

  return (
    <div style={{ minHeight: "65vh" }}>
      <Typography variant="subtitle1">Erkannte Wörter</Typography>
      <Box border="1px solid black" borderRadius="5px" padding="10px">
        <Typography variant="h6">
          {speechToTextContinuous.recognizingText}
        </Typography>
        <Typography variant="h6" color="primary">
          {speechToTextContinuous.translatingText}
        </Typography>
      </Box>
      <br />
      <Typography variant="subtitle1">Erkannte Sätze (nach Pause)</Typography>
      <Box border="1px solid black" borderRadius="5px" padding="10px">
        <Typography variant="h5">
          {speechToTextContinuous.recognizedText}
        </Typography>
        <Typography variant="h5" color="primary">
          {speechToTextContinuous.translatedText}
        </Typography>
        <br />
        <Button
          onClick={() =>
            synthesizeSpeech(speechToTextContinuous.recognizedText)
          }
          disabled={speechToTextContinuous.recognizedText.length < 1}
          color={isSynthesizing ? "secondary" : "primary"}
          variant="outlined"
          startIcon={<VolumeUp />}
        >
          Auf Schweizerdeutsch wiedergeben
        </Button>
      </Box>
      <br />
      <br />
      <Button
        onClick={speechToTextContinuous.sttFromMic}
        disabled={speechToTextContinuous.isRecognizing}
        variant="contained"
      >
        start recognition
      </Button>
      <Button
        onClick={speechToTextContinuous.sttFromMicStop}
        disabled={!speechToTextContinuous.isRecognizing}
        variant="contained"
      >
        stop recognition
      </Button>
      <br />
      <br />
      <FormControl>
        <InputLabel id="language-input-label">Output language</InputLabel>
        <Select
          style={{ minWidth: "200px" }}
          autoWidth
          labelId="language-select-label"
          id="language-select"
          value={speechToTextContinuous.translationTargetLanguage}
          label="Output language"
          onChange={handleTranslationLanguageChange}
        >
          {Object.values(SpeechTranslationLanguage).map((language) => (
            <MenuItem value={language} key={language}>
              {SpeechTranslationLanguagesNames[language]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default RealtimeTranscription;
