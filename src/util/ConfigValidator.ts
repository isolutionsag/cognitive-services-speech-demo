import SpeechServiceConfiguration from "../models/SpeechServiceConfiguration";
import QnAConfig from "../models/QnAConfig";
import TranslatorConfig from "../models/TranslatorConfig";
import BingSearchConfig from "../models/BingSearchConfig";

const configValueCheck = (value: string) => value && value !== "";

export const areAllConfigsValid = (
  mySpeechConfig: SpeechServiceConfiguration,
  qnaConfig: QnAConfig,
  translatorConfig: TranslatorConfig,
  bingSearchConfig: BingSearchConfig
) => {
  return (
    Object.values(mySpeechConfig).every(configValueCheck) &&
    Object.values(qnaConfig).every(configValueCheck) &&
    Object.values(translatorConfig).every(configValueCheck) &&
    Object.values(bingSearchConfig).every(configValueCheck)
  );
};
