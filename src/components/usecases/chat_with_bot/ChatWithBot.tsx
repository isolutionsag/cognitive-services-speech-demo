import { InfoOutlined, SettingsVoice, VolumeUp } from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { botLanguage } from "../../../api/BotApi";
import {
  makeTranslationRequest,
  TranslationResponse
} from "../../../api/TranslationApi";
import useBotResponse from "../../../hooks/useBotResponse";
import useSpeechToText from "../../../hooks/useSpeechToText";
import MySpeechConfig, {
  isValidSpeechConfig
} from "../../../models/MySpeechConfig";
import QnaConfig from "../../../models/QnAConfig";
import TranslatorConfig from "../../../models/TranslatorConfig";
import Language, {
  getVoiceForLanguage,
  InputLanguageLocale,
  languageModels
} from "../../../util/Language";
import { originalIfNotEmptyOr } from "../../../util/TextUtil";
import CustomIconButton from "../../common/CustomIconButton";
import { UseCaseTemplateChildProps } from "../UseCaseTemplate";
import LanguageRecognitionSelection, {
  LanguageRecognitionOption
} from "./LanguageRecognitionSelection";

class ChipSuggestion {
  private originalText: string;
  private germanText: string;
  private languageLocale: string;

  constructor(
    originalText: string,
    languageLocale: string,
    germanText?: string
  ) {
    this.originalText = originalText;
    this.languageLocale = languageLocale;
    this.germanText = germanText ?? originalText;
  }

  text(inSwissGerman: boolean) {
    if (inSwissGerman) return this.germanText;
    return this.originalText;
  }

  getLanguageLocale(inSwissGerman: boolean) {
    if (inSwissGerman) return InputLanguageLocale[Language.CH];
    return this.languageLocale;
  }
}

const chipSuggestions: ChipSuggestion[] = [
  new ChipSuggestion("Hallo, wie geht es dir?", "de-DE"),
  new ChipSuggestion("Kannst du Schweizerdeutsch sprechen?", "de-DE"),
  new ChipSuggestion("Quel âge as-tu?", "fr-FR", "Wie alt bist du?"),
  new ChipSuggestion(
    "What is the best company?",
    "en-EN",
    "Welche is die beste Firma?"
  ),
];

const defaultRecognitionLanguages = [
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

  const [recognizeOnlySwissGerman, setRecognizeOnlySwissGerman] =
    useState(false);

  const [recognitionLanguages, setRecognitionLanguages] = useState(
    defaultRecognitionLanguages
  );

  useEffect(() => {
    if (recognizeOnlySwissGerman) setRecognitionLanguages([Language.CH]);
    else setRecognitionLanguages(defaultRecognitionLanguages);
  }, [recognizeOnlySwissGerman]);

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
    if (!languageLocale) languageLocale = "";
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

  const handleSuggestionChipClick = (text: string, languageLocale: string) => {
    handleInputTextChange(text, languageLocale);
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

      if ([botLanguage, "ch"].includes(toLanguage)) {
        //no need to translate
        setError("");
        displayBotAnswer(_useBotResponse.answer, botLanguage);
        return;
      }

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

  const handleLanguageRecognitionSelection = (
    option: LanguageRecognitionOption
  ) => {
    const recognizeAuto = option === LanguageRecognitionOption.Automatic;
    setRecognizeOnlySwissGerman(!recognizeAuto);
  };

  const recognitionModeSelection = () => (
    <>
      <LanguageRecognitionSelection
        onChange={handleLanguageRecognitionSelection}
        selected={
          recognizeOnlySwissGerman
            ? LanguageRecognitionOption.SwissGerman
            : LanguageRecognitionOption.Automatic
        }
      />
      <Box sx={{ marginTop: ".5rem", display: "flex", alignItems: "center" }}>
        <InfoOutlined sx={{ color: "gray" }} fontSize="small" />
        <Typography variant="body2" color="GrayText" marginLeft=".4rem">
          {recognizeOnlySwissGerman
            ? "Ich erkenne nur Schweizerdeutsch"
            : "Ich erkenne Deutsch, Englisch, Französisch oder Italienisch"}
        </Typography>
      </Box>
    </>
  );

  const recordButton = () => (
    <CustomIconButton
      icon={
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
      }
      text={
        speechToText.isRecordingAndConverting ? "Ich höre zu..." : "Aufnehmen"
      }
    />
  ); 

  const suggestionChips = () => (
    <Stack direction="row" spacing={1}>
      {chipSuggestions.map((suggestion, i) => (
        <Chip
          key={"chip_" + i}
          onClick={() =>
            handleSuggestionChipClick(
              suggestion.text(recognizeOnlySwissGerman),
              suggestion.getLanguageLocale(recognizeOnlySwissGerman)
            )
          }
          label={suggestion.text(recognizeOnlySwissGerman)}
          color="primary"
          variant="outlined"
        />
      ))}
    </Stack>
  );

  const inputTextDisplay = () => {
    return speechToText.isRecordingAndConverting ? (
      <Skeleton variant="text" style={{ width: "100%" }} />
    ) : (
      <>
        <Typography variant="h5">
          {originalIfNotEmptyOr(inputText, "...")}
        </Typography>
        <Typography variant="body1" color="grey">
          {detectedLanguage.length > 0
            ? `Erkannte Sprache: ${detectedLanguage}`
            : ""}
        </Typography>
      </>
    );
  };

  const outputDisplay = () => {
    if (_useBotResponse.isFetching)
      return <Skeleton variant="text" style={{ width: "100%" }} />;
    if (outputText.length > 0)
      return (
        <Typography variant="h5" color="primary">
          {outputText}
        </Typography>
      );
    return (
      <Typography variant="h5" color="primary">
        Klicke den <em>Aufnehmen Knopf</em> and frag mich etwas...
      </Typography>
    );
  };

  const outputLanguageSelection = () => (
    <FormControl>
      <InputLabel id="language-input-label">Ausgabesprache</InputLabel>
      <Select
        style={{ minWidth: "200px" }}
        autoWidth
        labelId="language-select-label"
        id="language-select"
        value={outputLanguage}
        label="Ausgabesprache"
        onChange={handleOutputLanguageChange}
      >
        {languageModels
          .filter((model) => model.key !== Language.DE)
          .map((languageModel) => (
            <MenuItem value={languageModel.key} key={languageModel.key}>
              {languageModel.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );

  const synthesizeResponseButton = () => (
    <CustomIconButton
      icon={
        <IconButton
          size="large"
          disabled={!isValidSpeechConfig(mySpeechConfig)}
          color={isSynthesizing ? "secondary" : "primary"}
          onClick={() => synthesizeSpeech(outputText)}
          aria-label="Speak output"
        >
          <VolumeUp fontSize="large" />
        </IconButton>
      }
      text="Vorlesen"
    />
  );

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
        {recognitionModeSelection()}
        <br />
        {recordButton()}
        <br />
        {suggestionChips()}
        <br />
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          style={{ maxWidth: "600px" }}
        >
          {inputTextDisplay()}
          <Box sx={{ height: 30 }} />
          <Divider variant="middle" sx={{ width: "50%" }} />
          <Box sx={{ height: 30 }} />
          {outputDisplay()}
          <br />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {outputLanguageSelection()}
            <Box sx={{ width: 30 }} />
            {synthesizeResponseButton()}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatWithBot;
