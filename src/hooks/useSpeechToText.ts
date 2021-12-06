import MySpeechConfig, {
  getSpeechConfigFromMySpeechConfig,
  isValidSpeechConfig,
} from "../models/MySpeechConfig";
import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  ResultReason,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useState } from "react";
import Language, { InputLanguageLocale } from "../util/Language";

const infoTextTapToStartRecording =
  "Tap the record button and say something in EN, DE, FR or IT...";

export default function useSpeechToText(mySpeechConfig: MySpeechConfig) {
  const [infoText, setInfoText] = useState(infoTextTapToStartRecording);
  const [resultText, setResultText] = useState("");
  const [detectedLanguageLocale, setDetectedLanguage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [error, setError] = useState("");
  const [isRecordingAndConverting, setIsRecordingAndConverting] =
    useState(false);

  useEffect(() => {
    if (!isValidSpeechConfig(mySpeechConfig)) {
      setError(
        "To use the speech to speech service, please configure your keys of the azure speech service first"
      );
      setIsSuccess(false);
    }
  }, [mySpeechConfig]);

  function sttFromMic() {
    if (!isValidSpeechConfig(mySpeechConfig)) return;
    const speechConfig = getSpeechConfigFromMySpeechConfig(mySpeechConfig);
    const autoDetectConfig = AutoDetectSourceLanguageConfig.fromLanguages([
      InputLanguageLocale[Language.EN],
      InputLanguageLocale[Language.DE],
      InputLanguageLocale[Language.FR],
      InputLanguageLocale[Language.ES],
    ]); //max 4 languages for autodetection: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-automatic-language-detection?pivots=programming-language-javascript
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = SpeechRecognizer.FromConfig(
      speechConfig,
      autoDetectConfig,
      audioConfig
    );

    setInfoText("speak into your microphone...");
    setIsRecordingAndConverting(true);
    setError("");

    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === ResultReason.RecognizedSpeech) {
        setDetectedLanguage(result.language);
        setResultText(result.text);
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setError(
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly. Have you entered the correct config keys?"
        );
      }
      setInfoText(infoTextTapToStartRecording);
      setIsRecordingAndConverting(false);
    });
  }

  return {
    infoText,
    resultText,
    detectedLanguageLocale,
    isSuccess,
    error,
    sttFromMic,
    isRecordingAndConverting,
  };
}
