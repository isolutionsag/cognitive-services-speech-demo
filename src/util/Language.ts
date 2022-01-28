import { defaultVoice, Voice } from "./TextToSpechVoices";

enum Language {
  AUTO = "AUTO",
  DE = "DE",
  CH = "CH",
  EN = "EN",
  FR = "FR",
  IT = "IT",
  ES = "ES",
}

export default Language;

export const InputLanguageLocale: { [id in Language]: string } = {
  [Language.AUTO]: "auto",
  [Language.DE]: "de-DE",
  [Language.CH]: "de-CH",
  [Language.EN]: "en-US",
  [Language.FR]: "fr-FR",
  [Language.IT]: "it-IT",
  [Language.ES]: "es-ES",
};

export const OutputLanguageLocale: { [id in Language]: string } = {
  [Language.AUTO]: "auto",
  [Language.DE]: "de-CH",
  [Language.CH]: "de-CH",
  [Language.EN]: "en-US",
  [Language.FR]: "fr-FR",
  [Language.IT]: "it-IT",
  [Language.ES]: "es-ES",
};

export const LanguageLabels: { [id in Language]: string } = {
  [Language.AUTO]: "Auto (deine Sprache)",
  [Language.DE]: "Deutsch",
  [Language.CH]: "Schweizerdeutsch",
  [Language.EN]: "Englisch",
  [Language.FR]: "Französisch",
  [Language.IT]: "Italienisch",
  [Language.ES]: "Spanish",
};

export interface LanguageModel {
  key: Language;
  locale: string;
  label: string;
}

export function getLanguageModel(key: Language): LanguageModel {
  return { key, locale: InputLanguageLocale[key], label: LanguageLabels[key] };
}

export const languageModels: LanguageModel[] = Object.keys(Language).map(
  (key) => getLanguageModel(key as Language)
);

export function getVoiceForLanguage(language: Language | string): Voice {
  if (language === Language.AUTO || language === "") return defaultVoice;

  let locale =
    language.length <= 2 && language.toUpperCase() in Language
      ? OutputLanguageLocale[language.toUpperCase() as Language]
      : language;

  const localeSplit = locale.split("-");
  if (!localeSplit.every((part) => part.length <= 2)) locale = localeSplit[0]; //e.g. if language locale is "zh-hant" only use "zh" to find a matching voice

  const result = Object.values(Voice).find((v) => v.includes(locale));
  if (result) return result;
  return defaultVoice;
}
