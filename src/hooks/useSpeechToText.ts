import {
  ResultReason,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import Language from "../util/Language";
import { CreateSpeechRecognizer } from "../util/SpeechRecognizerCreator";

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
      recognizer.current = CreateSpeechRecognizer(
        mySpeechConfig,
        recognitionLanguages
      );
      setIsSuccess(true);
      setError("");
    } catch (e) {
      setIsSuccess(false);
      console.error("Failed to create speech recognizer: ", e);
      setError("Error: " + e);
    }
  }, [mySpeechConfig]);

  function sttFromMic() {
    setIsRecordingAndConverting(true);
    setError("");

    recognizer.current?.recognizeOnceAsync((result) => {
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
