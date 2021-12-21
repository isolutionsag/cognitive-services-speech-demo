import MySpeechConfig, { DefaultSpeechConfig, SpeechConfigKey } from "../models/MySpeechConfig";

const resourceKeyStorageKey = "resourceKey";
const regionStorageKey = "region";


export function loadSpeechConfig(): MySpeechConfig {
  var resourceKey = localStorage.getItem(resourceKeyStorageKey);
  var region = localStorage.getItem(regionStorageKey);

  let result = Object.assign({},  DefaultSpeechConfig);

  function checkShouldReplaceDefaultWithStorage(key: SpeechConfigKey, storageValue: string | null) {
    if (storageValue && storageValue.length > 0) result[key] = storageValue;
  }

  checkShouldReplaceDefaultWithStorage("resourceKey", resourceKey)
  checkShouldReplaceDefaultWithStorage("region", region)

  return result;
}

export function saveSpeechConfig(config: MySpeechConfig) {
  localStorage.setItem(resourceKeyStorageKey, config.resourceKey);
  localStorage.setItem(regionStorageKey, config.region);
}
