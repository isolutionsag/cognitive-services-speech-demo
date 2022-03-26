import { SpeechConfig } from "microsoft-cognitiveservices-speech-sdk";

export const DefaultSpeechConfig = {
  resourceKey: "" /* <your-resource/subscription-key> */,
  region: "" /* <your-region> */,
};

type SpeechServiceConfiguration = typeof DefaultSpeechConfig;
export default SpeechServiceConfiguration;

export type SpeechConfigKey = keyof SpeechServiceConfiguration

export const isValidSpeechConfig = (config: SpeechServiceConfiguration) => {
  return (
    config.resourceKey !== "" &&
    config.resourceKey !== undefined &&
    config.region !== "" &&
    config.region !== undefined
  );
};

export function getSpeechConfigFromMySpeechConfig(
  config: SpeechServiceConfiguration
): SpeechConfig {
  return SpeechConfig.fromSubscription(config.resourceKey, config.region);
}