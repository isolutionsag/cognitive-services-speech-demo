import { SpeechConfig } from "microsoft-cognitiveservices-speech-sdk";

export const DefaultSpeechConfig = {
  resourceKey: "" /* <your-resource/subscription-key> */,
  region: "" /* <your-region> */,
};

type MySpeechConfig = typeof DefaultSpeechConfig;
export default MySpeechConfig;

export type SpeechConfigKey = keyof MySpeechConfig

export const isValidSpeechConfig = (config: MySpeechConfig) => {
  console.log("region: " + config.region)
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