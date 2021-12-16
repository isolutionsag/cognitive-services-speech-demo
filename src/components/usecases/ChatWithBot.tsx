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
  languageModels,
} from "../../util/Language";

const recognitionLanguages = [
  Language.EN,
  Language.DE,
  Language.FR,
  Language.ES,
];

interface ChatWithBotProps {
  mySpeechConfig: MySpeechConfig;
  qnaConfig: QnaConfig;
  translatorConfig: TranslatorConfig;
}

const ChatWithBot: React.FC<ChatWithBotProps> = ({
  mySpeechConfig,
  qnaConfig,
  translatorConfig,
}) => {
  const useInputInput = useInput(
    "Hello, how are you?",
    () => "",
    undefined,
    false
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

  useEffect(() => {
    useInputInput.setValue(speechToText.resultText);

    const getTranslationForBot = async () => {
      const translationResponse = await makeTranslationRequest(
        speechToText.resultText,
        speechToText.detectedLanguageLocale,
        [botLanguage],
        translatorConfig
      );
      console.log("Input translation result: ", translationResponse);
      if (translationResponse.error)
        console.log("Failed to get translation for input");
      //TODO: show in UI? send original (unstranslated) question to bot?
      else {
        const translation = translationResponse.translations?.filter(
          (t) => t.to === botLanguage.split("-")[0].toLowerCase()
        );
        if (!translation || translation.length === 0) {
          console.log("No matching translation for bot language"); //TODO: show in UI? send original (unstranslated) question to bot?
          return;
        }
        const text = translation[0]?.text;
        console.log("Successfully translated text: ", text);
        setInputTranslation({ text });
      }
    };

    getTranslationForBot();
  }, [speechToText.resultText]);

  useEffect(() => {
    console.log(
      "Bot answer or outputLanguage changed: ",
      _useBotResponse.answer,
      outputLanguage
    );
    const getOutputTranslation = async () => {
      function getToLanguage(): string {
        if (outputLanguage !== Language.AUTO)
          return outputLanguage.toLocaleLowerCase();
        const detectedLanguageSplit =
          speechToText.detectedLanguageLocale.split("-");
        return detectedLanguageSplit[0];
      }

      const toLanguage = getToLanguage(); //lowercase language key (2 letters)
      console.log("To language: " + toLanguage);

      setOutputVoice(getVoiceForLanguage(toLanguage.toUpperCase() as Language));

      const translationResponse = await makeTranslationRequest(
        _useBotResponse.answer,
        botLanguage,
        [toLanguage],
        translatorConfig
      );
      if (translationResponse.error) {
        console.log(
          "Failed to get translation for bot response",
          translationResponse.error
        );
        displayBotAnswer(_useBotResponse.answer, botLanguage);
      } else {
        console.log("Bot response translations: ", translationResponse);
        const translation = translationResponse.translations?.filter(
          (t) => t.to === toLanguage
        );
        if (!translation || translation.length === 0) {
          console.log("No matching translation for output language");
          displayBotAnswer(_useBotResponse.answer, botLanguage);
          return;
        }
        displayBotAnswer(
          translation[0]?.text,
          toLanguage.toUpperCase() as Language
        );
      }
    };

    getOutputTranslation();
  }, [_useBotResponse.answer, outputLanguage]);

  function displayBotAnswer(text: string, language: Language) {
    useInputOutput.setValue(text);
    console.log("Displaying bot answer in ", language);
    textToSpeech.synthesizeSpeech(text, getVoiceForLanguage(language));
  }

  const handleOutputLanguageChange = (event: SelectChangeEvent) => {
    setOutputLanguage(event.target.value as Language);
  };

  return (
    <Grid container justifyContent="center">
      <Grid container item direction="column" alignItems="center" maxWidth="600px">
        <h1>Hi!</h1>
        <Typography variant="body1" gutterBottom>
          {speechToText.infoText}
        </Typography>

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
        <TextField
          style={{ marginTop: "20px" }}
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
              : `Detected language: ${speechToText.detectedLanguageLocale}`
          }
        />
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
              <MenuItem value={languageModel.key}>
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
  );
};

export default ChatWithBot;
