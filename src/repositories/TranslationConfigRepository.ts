import TranslatorConfig, {
  DefaultTranslatorConfig,
} from "../models/TranslatorConfig";

const predicate = "translator";
const resourceKeyStorageKey = "subscriptionKey";
const regionStorageKey = "region";

export function loadTranslatorConfig(): TranslatorConfig {
  const subscriptionKey = localStorage.getItem(
    getStorageKey(resourceKeyStorageKey)
  );
  const region = localStorage.getItem(getStorageKey(regionStorageKey));

  let result = Object.assign({}, DefaultTranslatorConfig);
  if (subscriptionKey && subscriptionKey.length > 0)
    result.subscriptionKey = subscriptionKey;
  if (region && region.length > 0)
    result.region = region;
  return result;
}

export function saveTranslatorConfig(config: TranslatorConfig) {
  localStorage.setItem(
    getStorageKey(resourceKeyStorageKey),
    config.subscriptionKey
  );
  localStorage.setItem(getStorageKey(regionStorageKey),
    config.region);
}

function getStorageKey(key: string) {
  return predicate + "_" + key;
}
