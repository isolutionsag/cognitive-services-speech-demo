import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import useSpeechToTextContinuous from "../../hooks/useSpeechToTextContinuous";
import MySpeechConfig from "../../models/MySpeechConfig";
import {
  SpeechTranslationLanguage,
  SpeechTranslationLanguagesNames,
} from "../../util/SupportedLanguages";

interface RealtimeTranscriptionProps {
  speechConfig: MySpeechConfig;
}

const RealtimeTranscription: React.FC<RealtimeTranscriptionProps> = ({
  speechConfig,
}) => {
  const speechToTextContinuous = useSpeechToTextContinuous(speechConfig);

  const handleTranslationLanguageChange = (event: SelectChangeEvent) => {
    speechToTextContinuous.setTranslationTargetLanguage(
      event.target.value as SpeechTranslationLanguage
    );
  };

  return (
    <div style={{ minHeight: "65vh" }}>
      <Typography variant="h3" noWrap>
        RealtimeTranscription
      </Typography>
      <Typography variant="body2">
        Fang einfach an zu reden, auf Schweizer- oder Hochdeutsch, wie du
        willst...
      </Typography>
      <Typography variant="body2" color="primary">
        Übersetzungungen sind blau.
      </Typography>
      <Typography variant="body2">
        Oben siehst du den aktuell gesprochenen Text und unten den vollständigen
        Text, nachdem du eine Pause gemacht hast.
      </Typography>
      <br />
      <br />
      <Typography variant="body1">
        {speechToTextContinuous.recognizingText}
      </Typography>
      <Typography variant="subtitle2" color="primary">
        {speechToTextContinuous.translatingText}
      </Typography>
      <br />
      <Typography variant="h6">
        {speechToTextContinuous.recognizedText}
      </Typography>
      <Typography variant="h6" color="primary">
        {speechToTextContinuous.translatedText}
      </Typography>
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
