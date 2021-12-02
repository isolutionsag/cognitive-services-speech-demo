import TranslatorConfig, { DefaultTranslatorConfig } from "../models/TranslatorConfig";

const resourceKeyStorageKey = "subscriptionKey";

export function loadTranslatorConfig(): TranslatorConfig {
  var subscriptionKey = localStorage.getItem(resourceKeyStorageKey);

  let result = DefaultTranslatorConfig;
  if (subscriptionKey) result.subscriptionKey = subscriptionKey;
  return result;
}

export function saveTranslatorConfig(config: TranslatorConfig) {  
  localStorage.setItem(resourceKeyStorageKey, config.subscriptionKey);
}
