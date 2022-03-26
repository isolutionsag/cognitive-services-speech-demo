import SpeechServiceConfiguration, { DefaultSpeechConfig, SpeechConfigKey } from "../models/SpeechServiceConfiguration";

const resourceKeyStorageKey = "resourceKey";
const regionStorageKey = "region";


export function loadSpeechConfig(): SpeechServiceConfiguration {
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

export function saveSpeechConfig(config: SpeechServiceConfiguration) {
  localStorage.setItem(resourceKeyStorageKey, config.resourceKey);
  localStorage.setItem(regionStorageKey, config.region);
}
