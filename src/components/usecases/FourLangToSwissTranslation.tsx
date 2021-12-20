import { SettingsVoice } from "@mui/icons-material";
import { Grid, IconButton, Skeleton, Typography } from "@mui/material";
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
  const { synthesizeSpeech } = useTextToSpeech(
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

      if (translationResponse.error)
        console.error("Failed to get translation for input");
      //TODO: show in UI? send original (unstranslated) question to bot?
      else {
        const translation = translationResponse.translations?.find(
          (t) => t.to === "de"
        );
        if (!translation) {
          console.error("No matching translation in de"); //TODO: show in UI? send original (unstranslated) question to bot?
          return;
        }
        const text = translation.text;
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
      <IconButton
        size="large"
        disabled={!isValidSpeechConfig(mySpeechConfig)}
        color={speechToText.isRecordingAndConverting ? "secondary" : "primary"}
        onClick={() => speechToText.sttFromMic()}
      >
        <SettingsVoice fontSize="large" />
      </IconButton>
      {speechToText.isRecordingAndConverting ? (
        <Skeleton variant="text" style={{ width: "100%", maxWidth: "500px"  }} />
      ) : (
        <>
          <Typography variant="h5">{speechToText.resultText}</Typography>
          <Typography variant="body2">
            {speechToText.detectedLanguageLocale !== ""
              ? `Detected language: ${speechToText.detectedLanguageLocale}`
              : ""}
          </Typography>
        </>
      )}
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
