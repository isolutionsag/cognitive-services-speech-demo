import { SettingsVoice } from "@mui/icons-material";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDidUpdate } from "rooks";
import { makeTranslationRequest } from "../../api/TranslationApi";
import useSpeechToText from "../../hooks/useSpeechToText";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import MySpeechConfig, {
  isValidSpeechConfig,
} from "../../models/MySpeechConfig";
import TranslatorConfig from "../../models/TranslatorConfig";
import Language from "../../util/Language";
import { Voice } from "../../util/TextToSpechVoices";

const recognitionLanguages = [
  Language.EN,
  Language.FR,
  Language.IT,
  Language.ES,
];

interface FourLangToSwissTranslationProps {
  mySpeechConfig: MySpeechConfig;
  translatorConfig: TranslatorConfig;
}

const FourLangToSwissTranslation: React.FC<FourLangToSwissTranslationProps> = ({
  mySpeechConfig,
  translatorConfig,
}) => {
  const speechToText = useSpeechToText(mySpeechConfig, recognitionLanguages);
  const [translation, setTranslation] = useState("");
  const { synthesizeSpeech, isSynthesizing } = useTextToSpeech(
    "",
    Voice.de_CH_LeniNeural,
    mySpeechConfig
  );

  useDidUpdate(() => {
    const getTranslation = async () => {
      const translationResponse = await makeTranslationRequest(
        speechToText.resultText,
        speechToText.detectedLanguageLocale,
        [Language.DE],
        translatorConfig
      );

      console.log("Input translation result: ", translationResponse);
      if (translationResponse.error)
        console.log("Failed to get translation for input");
      //TODO: show in UI? send original (unstranslated) question to bot?
      else {
        const translation = translationResponse.translations?.find(
          (t) => t.to === "de"
        );
        if (!translation) {
          console.log("No matching translation in de"); //TODO: show in UI? send original (unstranslated) question to bot?
          return;
        }
        const text = translation.text;
        console.log("Successfully translated text: ", text);
        setTranslation(text);
      }
    };

    getTranslation();
  }, [speechToText.resultText]);

  useDidUpdate(() => {
    synthesizeSpeech(translation);
  }, [translation]);

  return (
    <Grid container direction="column" alignItems="center">
      <Typography variant="h3" noWrap>
        Übersetzung ins Schweizerdeutsch
      </Typography>
      <Typography variant="body2">
        Spreche in EN, FR, IT, ES und erhalte nach einem Satz die
        Schweizerdeutsche Übersetung gesprochen zurück
      </Typography>
      <br />
      <br />
      <IconButton
        size="large"
        disabled={!isValidSpeechConfig(mySpeechConfig)}
        color={speechToText.isRecordingAndConverting ? "secondary" : "primary"}
        onClick={() => speechToText.sttFromMic()}
      >
        <SettingsVoice fontSize="large" />
      </IconButton>
      <Typography variant="h5">{speechToText.resultText}</Typography>
      <Typography variant="body2">
        {speechToText.detectedLanguageLocale !== ""
          ? `Detected language: ${speechToText.detectedLanguageLocale}`
          : ""}
      </Typography>
      <br />
      <br />
      <Typography variant="h4" color="primary">
        {translation}
      </Typography>
      <br />
    </Grid>
  );
};

export default FourLangToSwissTranslation;
