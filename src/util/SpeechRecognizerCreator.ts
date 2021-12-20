import {
  AudioConfig,
  SpeechRecognizer,
  AutoDetectSourceLanguageConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import MySpeechConfig, {
  getSpeechConfigFromMySpeechConfig,
  isValidSpeechConfig,
} from "../models/MySpeechConfig";
import Language, { InputLanguageLocale } from "./Language";
import { SpeechServiceLocale } from "./SupportedLanguages";

export function CreateSpeechRecognizer(
  mySpeechConfig: MySpeechConfig,
  recognitionLanguages: Language[]
): SpeechRecognizer {
  if (
    !isValidSpeechConfig(mySpeechConfig) ||
    recognitionLanguages === undefined ||
    recognitionLanguages.length === 0
  )
    throw new Error("parameter missing in method CreateSpeechRecognizer");

  // max 4 languages for autodetection: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-automatic-language-detection?pivots=programming-language-javascript
  if (recognitionLanguages.length > 4)
    throw new Error("Cannot have more than 4 speech recognition languages");

  const speechConfig = getSpeechConfigFromMySpeechConfig(mySpeechConfig);
  const autoDetectConfig = AutoDetectSourceLanguageConfig.fromLanguages(
    recognitionLanguages.map((l) => InputLanguageLocale[l])
  );

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
  return SpeechRecognizer.FromConfig(
    speechConfig,
    autoDetectConfig,
    audioConfig
  );
}

export function CreateSpeechRecognizerSingleLanguage(
  mySpeechConfig: MySpeechConfig,
  recognitionLanguage: SpeechServiceLocale
): SpeechRecognizer {
  if (
    !isValidSpeechConfig(mySpeechConfig) ||
    recognitionLanguage === undefined
  )
    throw new Error("parameter missing in method CreateSpeechRecognizer");

    const speechConfig = getSpeechConfigFromMySpeechConfig(mySpeechConfig);
    speechConfig.speechRecognitionLanguage = recognitionLanguage;
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    return new SpeechRecognizer(speechConfig, audioConfig);
}