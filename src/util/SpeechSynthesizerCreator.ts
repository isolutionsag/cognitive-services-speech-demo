import {
  AudioConfig,
  SpeechSynthesizer,
} from "microsoft-cognitiveservices-speech-sdk";
import MySpeechConfig, {
  getSpeechConfigFromMySpeechConfig,
  isValidSpeechConfig,
} from "../models/MySpeechConfig";
import { SpeechServiceLocale } from "./SupportedLanguages";
import { Voice } from "./TextToSpechVoices";

export function CreateSpeechSynthesizer(
  speechConfig: MySpeechConfig,
  speechSynthesisLanguage: SpeechServiceLocale,
  voice: Voice
): SpeechSynthesizer {
  if (
    !isValidSpeechConfig(speechConfig) ||
    speechSynthesisLanguage === undefined ||
    voice === undefined
  )
    throw new Error("Invalid config to create SpeechRecognizer for text");

  const config = getSpeechConfigFromMySpeechConfig(speechConfig);
  config.speechSynthesisLanguage = speechSynthesisLanguage;
  config.speechSynthesisVoiceName = voice;

  const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
  return new SpeechSynthesizer(config, audioConfig);
}
