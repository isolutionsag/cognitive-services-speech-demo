import { ForumOutlined, SettingsVoice, VolumeUp } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent, 
  Chip,
  Stack,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useInput from "../../hooks/useInput";
import MySpeechConfig, {
  isValidSpeechConfig,
} from "../../models/MySpeechConfig";
import QnaConfig from "../../models/QnAConfig";
import useSpeechToText from "../../hooks/useSpeechToText";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import useBotResponse from "../../hooks/useBotResponse";
import { makeTranslationRequest } from "../../api/TranslationApi";
import { botLanguage } from "../../api/BotApi";
import TranslatorConfig from "../../models/TranslatorConfig";
import Language, {
  getVoiceForLanguage,
  InputLanguageLocale,
  languageModels,
} from "../../util/Language";
import { UseCaseTemplateChildProps } from "./UseCaseTemplate";

interface ChipSuggestion {
  text: string;
  languageLocale: string;
}

const chipSuggestions: ChipSuggestion[] = [
  { text: "Hallo, wie geht es dir?", languageLocale: "de-DE" },
  { text: "Kannst du Schweizerdeutsch sprechen?", languageLocale: "de-DE" },
  { text: "Quel âge as-tu?", languageLocale: "fr-FR" },
  { text: "What is the best company?", languageLocale: "en-EN" },
];

const recognitionLanguages = [
  Language.EN,
  Language.DE,
  Language.FR,
  Language.IT,
];

interface ChatWithBotProps extends UseCaseTemplateChildProps {
  mySpeechConfig: MySpeechConfig;
  qnaConfig: QnaConfig;
  translatorConfig: TranslatorConfig;
}

const ChatWithBot: React.FC<ChatWithBotProps> = ({
  mySpeechConfig,
  qnaConfig,
  translatorConfig,
  setError,
}) => {
  const useInputInput = useInput(
    "Hello, how are you?",
    () => "",
    undefined,
    false
  );

  const [detectedLanguage, setDetectedLanguage] = useState(
    InputLanguageLocale[Language.DE]
  );

  const [outputLanguage, setOutputLanguage] = useState(Language.AUTO);
  const [outputVoice, setOutputVoice] = useState(
    getVoiceForLanguage(outputLanguage)
  );

  const [inputTranslation, setInputTranslation] = useState({ text: "" });

  const speechToText = useSpeechToText(mySpeechConfig, recognitionLanguages);
  const _useBotResponse = useBotResponse(inputTranslation, qnaConfig);

  const useInputOutput = useInput("", () => "", undefined, false);
  const textToSpeech = useTextToSpeech(
    useInputOutput.value,
    outputVoice,
    mySpeechConfig
  );

  const handleInputTextChange = (text: string, languageLocale: string) => {
    useInputInput.setValue(text);
    setDetectedLanguage(languageLocale);

    const getTranslationForBot = async () => {
      const translationResponse = await makeTranslationRequest(
        text,
        languageLocale,
        [botLanguage],
        translatorConfig
      );
      if (translationResponse.error)
        console.error("Failed to get translation for input: ", translationResponse.error);
      //TODO: show in UI? send original (unstranslated) question to bot?
      else {
        const translation = translationResponse.translations?.filter(
          (t) => t.to === botLanguage.split("-")[0].toLowerCase()
        );
        if (!translation || translation.length === 0) {
          console.error("No matching translation for bot language"); //TODO: show in UI? send original (unstranslated) question to bot?
          return;
        }
        const text = translation[0]?.text;
        setInputTranslation({ text });
      }
    };

    getTranslationForBot();
  };

  useEffect(() => {
    handleInputTextChange(
      speechToText.resultText,
      speechToText.detectedLanguageLocale
    );
  }, [speechToText.resultText]);

  useEffect(() => {
    setError(_useBotResponse.error);
  }, [_useBotResponse.error]);

  useEffect(() => {
    const getOutputTranslation = async () => {
      function getToLanguage(): string {
        if (outputLanguage !== Language.AUTO)
          return outputLanguage.toLocaleLowerCase();
        const detectedLanguageSplit = detectedLanguage.split("-");
        return detectedLanguageSplit[0];
      }

      const toLanguage = getToLanguage(); //lowercase language key (2 letters)

      setOutputVoice(getVoiceForLanguage(toLanguage.toUpperCase() as Language));

      const translationResponse = await makeTranslationRequest(
        _useBotResponse.answer,
        botLanguage,
        [toLanguage],
        translatorConfig
      );
      if (translationResponse.error) {
        console.error(
          "Failed to get translation for bot response",
          translationResponse.error
        );
        displayBotAnswer(_useBotResponse.answer, botLanguage);
      } else {
        const translation = translationResponse.translations?.find(
          (t) => t.to === toLanguage
        );
        if (!translation) {
          console.error("No matching translation for output language");
          displayBotAnswer(_useBotResponse.answer, botLanguage);
          return;
        }
        displayBotAnswer(
          translation.text,
          toLanguage.toUpperCase() as Language
        );
      }
    };

    getOutputTranslation();
  }, [_useBotResponse.answer, outputLanguage]);

  function displayBotAnswer(text: string, language: Language) {
    useInputOutput.setValue(text);
    textToSpeech.synthesizeSpeech(text, getVoiceForLanguage(language));
  }

  const handleOutputLanguageChange = (event: SelectChangeEvent) => {
    setOutputLanguage(event.target.value as Language);
  };

  return (
    <Grid container justifyContent="center">
      <Grid container item direction="column" alignItems="center" justifyContent="center">
        <Typography variant="body2" color="orange" gutterBottom>
          {speechToText.error}
        </Typography>
        <IconButton
          size="large"
          disabled={!isValidSpeechConfig(mySpeechConfig)}
          color={
            speechToText.isRecordingAndConverting ? "secondary" : "primary"
          }
          onClick={() => speechToText.sttFromMic()}
        >
          <SettingsVoice fontSize="large" />
        </IconButton>
        <Stack direction="row" spacing={1}>
          {chipSuggestions.map((suggestion, i) => (
            <Chip
              key={"chip_" + i}
              onClick={() =>
                handleInputTextChange(
                  suggestion.text,
                  suggestion.languageLocale
                )
              }
              label={suggestion.text}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
        <br />
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          style={{maxWidth: "600px"}}
        >
          {speechToText.isRecordingAndConverting ? (
            <Skeleton variant="text" style={{ width: "100%" }} />
          ) : (
            <TextField
              multiline
              fullWidth
              name="Input"
              id="Input"
              label="Input"
              value={useInputInput.value}
              onChange={useInputInput.handleChange}
              error={useInputInput.error !== ""}
              helperText={
                useInputInput.error !== ""
                  ? useInputInput.error
                  : `Detected language: ${detectedLanguage}`
              }
            />
          )}
          <div style={{ padding: "20px" }}>
            <ForumOutlined style={{ height: "50px", width: "50px" }} />
          </div>
          <FormControl>
            <InputLabel id="language-input-label">Output language</InputLabel>
            <Select
              style={{ minWidth: "200px" }}
              autoWidth
              labelId="language-select-label"
              id="language-select"
              value={outputLanguage}
              label="Output language"
              onChange={handleOutputLanguageChange}
            >
              {languageModels.map((languageModel) => (
                <MenuItem value={languageModel.key} key={languageModel.key}>
                  {languageModel.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            style={{ marginTop: "10px" }}
            multiline
            minRows={3}
            fullWidth
            name="Bot response"
            id="Bot response"
            label="Bot response"
            value={useInputOutput.value}
            onChange={useInputOutput.handleChange}
            error={useInputOutput.error !== ""}
            helperText={useInputOutput.error}
          />

          <IconButton
            size="large"
            disabled={!isValidSpeechConfig(mySpeechConfig)}
            color={textToSpeech.isSynthesizing ? "secondary" : "primary"}
            onClick={() => textToSpeech.synthesizeSpeech()}
            aria-label="Speak output"
            style={{ marginTop: "20px" }}
          >
            <VolumeUp fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatWithBot;
