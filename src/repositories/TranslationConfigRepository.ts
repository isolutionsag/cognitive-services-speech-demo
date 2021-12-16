import TranslatorConfig, { DefaultTranslatorConfig } from "../models/TranslatorConfig";

const predicate = "translator"
const resourceKeyStorageKey = "subscriptionKey";

export function loadTranslatorConfig(): TranslatorConfig {
  var subscriptionKey = localStorage.getItem(getStorageKey(resourceKeyStorageKey));

  let result = DefaultTranslatorConfig;
  if (subscriptionKey) result.subscriptionKey = subscriptionKey;
  return result;
}

export function saveTranslatorConfig(config: TranslatorConfig) {  
  localStorage.setItem(getStorageKey(resourceKeyStorageKey), config.subscriptionKey);
}

function getStorageKey(key: string){
  return predicate + "_" + key;
}