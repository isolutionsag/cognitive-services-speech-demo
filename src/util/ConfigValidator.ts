import MySpeechConfig from "../models/MySpeechConfig";
import QnAConfig from "../models/QnAConfig";
import TranslatorConfig from "../models/TranslatorConfig";
import BingSearchConfig from "../models/BingSearchConfig";

const configValueCheck = (value: string) => value && value !== "";

export const areAllConfigsValid = (
  mySpeechConfig: MySpeechConfig,
  qnaConfig: QnAConfig,
  translatorConfig: TranslatorConfig,
  bingSearchConfig: BingSearchConfig
) => {
  console.log(
    "areAllConfigsValid?",
    mySpeechConfig,
    qnaConfig,
    translatorConfig,
    bingSearchConfig
  );
  const res = (
    Object.values(mySpeechConfig).every(configValueCheck) &&
    Object.values(qnaConfig).every(configValueCheck) &&
    Object.values(translatorConfig).every(configValueCheck) &&
    Object.values(bingSearchConfig).every(configValueCheck)
  );
  console.log("res: ", res);
  return res;
};
