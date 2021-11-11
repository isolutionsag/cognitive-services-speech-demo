import MySpeechConfig, { DefaultSpeechConfig } from "../models/MySpeechConfig";

const resourceKeyStorageKey = "resourceKey";
const regionStorageKey = "region";

export function loadSpeechConfig(): MySpeechConfig {
  var resourceKey = localStorage.getItem(resourceKeyStorageKey);
  var region = localStorage.getItem(regionStorageKey);

  let result = DefaultSpeechConfig;
  if (resourceKey) result.resourceKey = resourceKey;
  if (region) result.region = region;
  return result;
}

export function saveSpeechConfig(config: MySpeechConfig) {
  localStorage.setItem(resourceKeyStorageKey, config.resourceKey);
  localStorage.setItem(regionStorageKey, config.region);
}
