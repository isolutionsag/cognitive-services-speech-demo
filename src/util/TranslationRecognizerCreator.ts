import {
  AudioConfig,
  SpeechTranslationConfig,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import SpeechServiceConfiguration, { isValidSpeechConfig } from "../models/SpeechServiceConfiguration";
import { SpeechServiceLocale, SpeechTranslationLanguage } from "./SupportedLanguages";

export function CreateTranslator(
  speechConfig: SpeechServiceConfiguration,
  sourceLanguage: SpeechServiceLocale,
  targetLanguage: SpeechTranslationLanguage
): TranslationRecognizer {
  if (
    !isValidSpeechConfig(speechConfig) ||
    sourceLanguage === undefined ||
    targetLanguage === undefined
  )
    throw new Error("parameter missing in method CreateTranslator ");

  let speechTranslationConfig = SpeechTranslationConfig.fromSubscription(
    speechConfig.resourceKey,
    speechConfig.region
  );
  speechTranslationConfig.speechRecognitionLanguage = sourceLanguage;
  speechTranslationConfig.addTargetLanguage(targetLanguage);
  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
  return new TranslationRecognizer(speechTranslationConfig, audioConfig);
}
