import BingSearchConfig, { DefaultBingSearchConfig } from "../models/BingSearchConfig";

const predicate = "bingSearch"
const resourceKeyStorageKey = "subscriptionKey";

export function loadBingSearchConfig(): BingSearchConfig {
  var subscriptionKey = localStorage.getItem(getStorageKey(resourceKeyStorageKey));

  let result = DefaultBingSearchConfig;
  if (subscriptionKey) result.subscriptionKey = subscriptionKey;
  return result;
}

export function saveBingSearchConfig(config: BingSearchConfig) {  
  localStorage.setItem(getStorageKey(resourceKeyStorageKey), config.subscriptionKey);
}

function getStorageKey(key: string){
    return predicate + "_" + key;
}