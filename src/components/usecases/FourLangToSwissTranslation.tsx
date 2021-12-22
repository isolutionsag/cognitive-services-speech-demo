import { SettingsVoice } from "@mui/icons-material";
import { Grid, IconButton, Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDidUpdate } from "rooks";
import { makeTranslationRequest } from "../../api/TranslationApi";
import useSpeechToText from "../../hooks/useSpeechToText";
import MySpeechConfig, {
  isValidSpeechConfig,
} from "../../models/MySpeechConfig";
import TranslatorConfig from "../../models/TranslatorConfig";
import Language from "../../util/Language";
import { Voice } from "../../util/TextToSpechVoices";
import { originalIfNotEmptyOr } from "../../util/TextUtil";
import CustomIconButton from "../common/CustomIconButton";
import { UseCaseTemplateChildProps } from "./UseCaseTemplate";

const recognitionLanguages = [
  Language.EN,
  Language.FR,
  Language.IT,
  Language.ES,
];

interface FourLangToSwissTranslationProps extends UseCaseTemplateChildProps {
  mySpeechConfig: MySpeechConfig;
  translatorConfig: TranslatorConfig;
}

const FourLangToSwissTranslation: React.FC<FourLangToSwissTranslationProps> = ({
  mySpeechConfig,
  translatorConfig,
  synthesizeSpeech,
  setError,
}) => {
  const speechToText = useSpeechToText(mySpeechConfig, recognitionLanguages);
  const [translation, setTranslation] = useState("");

  useDidUpdate(() => {
    const getTranslation = async () => {
      const translationResponse = await makeTranslationRequest(
        speechToText.resultText,
        speechToText.detectedLanguageLocale,
        [Language.DE],
        translatorConfig
      );

      if (translationResponse.error) {
        setError(
          "Failed to get translation for input: " + translationResponse.error
        );
      } else {
        const translation = translationResponse.translations?.find(
          (t) => t.to.toLowerCase() === "de"
        );
        if (!translation) {
          setError(
            `No matching translation in german ("de"). Translations response: ` +
              JSON.stringify(translationResponse.translations)
          );
          return;
        }
        setError("");
        const text = translation.text;
        setTranslation(text);
      }
    };

    getTranslation();
  }, [speechToText.resultText]);

  useDidUpdate(() => {
    synthesizeSpeech(translation, Voice.de_CH_LeniNeural);
  }, [translation]);

  return (
    <Grid container direction="column" alignItems="center">
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
      <br />
      {speechToText.isRecordingAndConverting ? (
        <Skeleton variant="text" style={{ width: "100%", maxWidth: "500px" }} />
      ) : (
        <>
          <Typography variant="h5">
            {originalIfNotEmptyOr(
              speechToText.resultText,
              "Clicke den Aufnehme Knopf und sag etwas..."
            )}
          </Typography>
          <Typography variant="body2">
            {speechToText.detectedLanguageLocale !== ""
              ? `Erkannte Sprache: ${speechToText.detectedLanguageLocale}`
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
