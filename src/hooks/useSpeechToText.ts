import MySpeechConfig, {
  getSpeechConfigFromMySpeechConfig,
  isValidSpeechConfig,
} from "../models/MySpeechConfig";
import {
  AudioConfig,
  ResultReason,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useState } from "react";

const infoTextTapToStartRecording =
  "Tap the record button and say something...";

export default function useSpeechToText(mySpeechConfig: MySpeechConfig) {
  const [infoText, setInfoText] = useState(infoTextTapToStartRecording);
  const [resultText, setResultText] = useState("");
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
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    setInfoText("speak into your microphone...");
    setIsRecordingAndConverting(true);
    setError("");

    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === ResultReason.RecognizedSpeech) {
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
    isSuccess,
    error,
    sttFromMic,
    isRecordingAndConverting,
  };
}
