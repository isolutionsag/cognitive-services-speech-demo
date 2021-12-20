import MySpeechConfig from "../models/MySpeechConfig";
import QnAConfig from "../models/QnAConfig";
import TranslatorConfig from "../models/TranslatorConfig";
import BingSearchConfig from "../models/BingSearchConfig";

const configValueCheck = (value: string) => value !== undefined && value !== "";

export const areAllConfigsValid = (
  mySpeechConfig: MySpeechConfig,
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
