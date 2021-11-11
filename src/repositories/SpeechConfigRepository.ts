import MySpeechConfig, { DefaultSpeechConfig } from "../models/MySpeechConfig";

const speechConfigStorageKey = "speechConnectionStrings";

export function loadSpeechConfig(): MySpeechConfig {
  var saveData = localStorage.getItem(speechConfigStorageKey);
  if (saveData == null) return DefaultSpeechConfig;
  
  const parsed = JSON.parse(saveData);
  let result = DefaultSpeechConfig
  result = {...result, ...parsed}
  return result
}

export function saveSpeechConfig(connectionStrings: MySpeechConfig) {
  return localStorage.setItem(
    speechConfigStorageKey,
    JSON.stringify(connectionStrings)
  );
}
