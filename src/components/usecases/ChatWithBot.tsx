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
import MySpeechConfig, {
  isValidSpeechConfig,
} from "../../models/MySpeechConfig";
import QnaConfig from "../../models/QnAConfig";
import useSpeechToText from "../../hooks/useSpeechToText";
import useBotResponse from "../../hooks/useBotResponse";
import {
  makeTranslationRequest,
  TranslationResponse,
} from "../../api/TranslationApi";
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
  synthesizeSpeech,
  isSynthesizing,
  setError,
}) => {
  const [detectedLanguage, setDetectedLanguage] = useState(
    InputLanguageLocale[Language.DE]
  );

  const [inputText, setInputText] = useState("");
  const [outputLanguage, setOutputLanguage] = useState(Language.AUTO);
  const [inputTranslation, setInputTranslation] = useState({ text: "" });
  const [outputText, setOutputText] = useState("");

  const speechToText = useSpeechToText(mySpeechConfig, recognitionLanguages);
  const _useBotResponse = useBotResponse(inputTranslation, qnaConfig);

  const handleTranslationResponseError = (err: any) => {
    setError(
      "Failed to get translation for input: " +
        err +
        ". Is your translation config correct?"
    );
  };

  const handleTranslationResultError = (result: TranslationResponse) => {
    setError(
      `No matching translation in botlanguage ("${botLanguage}"). Translations response: ` +
        JSON.stringify(result.translations)
    );
  };

  const handleInputTextChange = (text: string, languageLocale: string) => {
    setInputText(text);
    setDetectedLanguage(languageLocale);

    const getTranslationForBot = async () => {
      const translationResponse = await makeTranslationRequest(
        text,
        languageLocale,
        [botLanguage],
        translatorConfig
      );
      if (translationResponse.error)
        handleTranslationResponseError(translationResponse.error);
      else {
        const translation = translationResponse.translations?.filter(
          (t) => t.to === botLanguage.split("-")[0].toLowerCase()
        );
        if (!translation) {
          handleTranslationResultError(translationResponse);
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
        if (detectedLanguage.length === 0) return "de";
        const detectedLanguageSplit = detectedLanguage.split("-");
        return detectedLanguageSplit[0];
      }

      const toLanguage = getToLanguage(); //lowercase language key (2 letters)

      const translationResponse = await makeTranslationRequest(
        _useBotResponse.answer,
        botLanguage,
        [toLanguage],
        translatorConfig
      );

      if (translationResponse.error) {
        handleTranslationResponseError(translationResponse.error);
        displayBotAnswer(_useBotResponse.answer, botLanguage);
      } else {
        const translation = translationResponse.translations?.find(
          (t) => t.to === toLanguage
        );
        if (!translation) {
          handleTranslationResultError(translationResponse);
          displayBotAnswer(_useBotResponse.answer, botLanguage);
          return;
        }
        setError("");
        displayBotAnswer(
          translation.text,
          toLanguage.toUpperCase() as Language
        );
      }
    };

    getOutputTranslation();
  }, [_useBotResponse.answer, outputLanguage]);

  function displayBotAnswer(text: string, language: Language) {
    setOutputText(text);
    synthesizeSpeech(text, getVoiceForLanguage(language));
  }

  const handleOutputLanguageChange = (event: SelectChangeEvent) => {
    setOutputLanguage(event.target.value as Language);
  };

  return (
    <Grid container justifyContent="center">
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
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
          style={{ maxWidth: "600px" }}
        >
          {speechToText.isRecordingAndConverting ? (
            <Skeleton variant="text" style={{ width: "100%" }} />
          ) : (
            <>
              <Typography variant="h5">
                {inputText.length > 0 ? inputText : "..."}
              </Typography>
              <Typography variant="body1" color="grey">
                {detectedLanguage.length > 0
                  ? `Detected language: ${detectedLanguage}`
                  : ""}
              </Typography>
            </>
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
          <br />
          {_useBotResponse.isFetching ? (
            <Skeleton variant="text" style={{ width: "100%" }} />
          ) : (
            <Typography variant="h5" color="primary">
              {outputText.length > 0
                ? outputText
                : "Clicke den Aufnehme Knopf and frag mich etwas..."}
            </Typography>
          )}
          <IconButton
            size="large"
            disabled={!isValidSpeechConfig(mySpeechConfig)}
            color={isSynthesizing ? "secondary" : "primary"}
            onClick={() => synthesizeSpeech(outputText)}
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
