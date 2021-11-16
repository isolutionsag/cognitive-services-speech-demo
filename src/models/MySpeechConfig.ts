import { SpeechConfig } from "microsoft-cognitiveservices-speech-sdk";

export const DefaultSpeechConfig = {
  resourceKey: "",
  region: "",
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
  res.speechRecognitionLanguage = config.speechRecognitionLanguage;
  res.speechSynthesisLanguage = config.speechSynthesisLanguage;
  res.speechSynthesisVoiceName = config.voiceName;
  return res;
}