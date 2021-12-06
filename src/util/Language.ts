import { Voice, defaultVoice } from "./TextToSpechVoices";

enum Language {
  AUTO = "AUTO",
  DE = "DE",
  EN = "EN",
  FR = "FR",
  ES = "ES",
}

export default Language;

export const InputLanguageLocale: { [id in Language]: string } = {
  [Language.AUTO]: "auto",
  [Language.DE]: "de-DE",
  [Language.EN]: "en-US",
  [Language.FR]: "fr-FR",
  [Language.ES]: "es-ES",
};

export const OutputLanguageLocale: { [id in Language]: string } = {
  [Language.AUTO]: "auto",
  [Language.DE]: "de-CH",
  [Language.EN]: "en-US",
  [Language.FR]: "fr-FR",
  [Language.ES]: "es-ES",
};

export const LanguageLabels: { [id in Language]: string } = {
  [Language.AUTO]: "Auto (same as input)",
  [Language.DE]: "Deutsch",
  [Language.EN]: "Englisch",
  [Language.FR]: "Französisch",
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
  if (language === Language.AUTO) return defaultVoice;
  const locale =
    language.length <= 2
      ? OutputLanguageLocale[language as Language]
      : language;

  const result = Object.values(Voice).filter((v) => v.includes(locale));
  console.log("Get voice for language: ", result, locale);

  //result = Object.values(Voice).filter(v => getLanguageLocalFromVoice(v) === LanguageLocale[language])
  if (result.length > 0) return result[0];
  return defaultVoice;
}
