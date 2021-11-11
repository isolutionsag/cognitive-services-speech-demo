export const DefaultSpeechConfig = {
  resourceKey: "",
  region: "",
  speechRecognitionLanguage: "de-CH",
  voiceName: "leni",
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
