import {
  ResultReason,
  SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import Language, { InputLanguageLocale } from "../util/Language";
import {
  CreateSpeechRecognizer,
  CreateSpeechRecognizerSingleLanguage
} from "../util/SpeechRecognizerCreator";
import { SpeechServiceLocale } from "../util/SupportedLanguages";

export default function useSpeechToText(
  mySpeechConfig: MySpeechConfig,
  recognitionLanguages: Language[]
) {
  const [resultText, setResultText] = useState("");
  const [detectedLanguageLocale, setDetectedLanguage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [error, setError] = useState("");
  const [isRecordingAndConverting, setIsRecordingAndConverting] =
    useState(false);
  const recognizer = useRef<SpeechRecognizer>();

  useEffect(() => {
    try {
      if (recognitionLanguages.length === 1) {
        recognizer.current = CreateSpeechRecognizerSingleLanguage(
          mySpeechConfig,
          InputLanguageLocale[recognitionLanguages[0]] as SpeechServiceLocale
        );
      } else {
        recognizer.current = CreateSpeechRecognizer(
          mySpeechConfig,
          recognitionLanguages
        );
      }
      setIsSuccess(true);
      setError("");
    } catch (e) {
      setIsSuccess(false);
      console.error("Failed to create speech recognizer: ", e);
      setError("Error: " + e);
    }
  }, [mySpeechConfig, recognitionLanguages]);

  function sttFromMic() {
    setIsRecordingAndConverting(true);
    setError("");

    recognizer.current?.recognizeOnceAsync((result) => {
      if (result.reason === ResultReason.RecognizedSpeech) {
        const recognitionLanguage =
          recognitionLanguages.length === 1
            ? InputLanguageLocale[recognitionLanguages[0]] // recognition has to be the only language requested to be recognized
            : result.language;
        setDetectedLanguage(recognitionLanguage);
        setResultText(result.text);
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setError(
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly. Have you entered the correct config keys?"
        );
      }
      setIsRecordingAndConverting(false);
    });
  }

  return {
    resultText,
    detectedLanguageLocale,
    isSuccess,
    error,
    sttFromMic,
    isRecordingAndConverting,
  };
}
