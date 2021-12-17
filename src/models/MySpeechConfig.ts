import { SpeechConfig } from "microsoft-cognitiveservices-speech-sdk";

export const DefaultSpeechConfig = {
  resourceKey: "a0e76233b7f8486d984ed115ba915dd8",
  region: "westeurope",
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
  return SpeechConfig.fromSubscription(config.resourceKey, config.region);
}