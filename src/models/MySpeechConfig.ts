import { SpeechConfig } from "microsoft-cognitiveservices-speech-sdk";

export const DefaultSpeechConfig = {
  resourceKey: "a0e76233b7f8486d984ed115ba915dd8",
  region: "westeurope",
  speechRecognitionLanguage: "de-CH",
  speechSynthesisLanguage: "de-CH",
  voiceName: "de-CH-LeniNeural", //supported: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#neural-voices
};

type MySpeechConfig = typeof DefaultSpeechConfig;
export default MySpeechConfig;

export const isValidSpeechConfig = (config: MySpeechConfig) => {
  return (
    config.resourceKey !== "" &&
    config.resourceKey !== undefined &&
    config.region !== "" &&
    config.region !== undefined
  );
};

export function getSpeechConfigFromMySpeechConfig(
  config: MySpeechConfig
): SpeechConfig {
  const res = SpeechConfig.fromSubscription(config.resourceKey, config.region);
  res.speechSynthesisLanguage = config.speechSynthesisLanguage;
  res.speechSynthesisVoiceName = config.voiceName;
  return res;
}