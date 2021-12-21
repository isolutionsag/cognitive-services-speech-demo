import QnAConfig, { DefaultQnAConfig, QnAConfigKey } from "../models/QnAConfig";

const kbIdKey = "knowledgeBase";
const authEndpointKeyKey = "authEndpointKey";
const qnaMakerServiceNameKey = "qnaMakerServicename";

export function loadQnAConfig(): QnAConfig {
  var kbId = localStorage.getItem(kbIdKey);
  var authEndpointKey = localStorage.getItem(authEndpointKeyKey);
  var qnaMakerServiceName = localStorage.getItem(qnaMakerServiceNameKey);

  let result = Object.assign({},  DefaultQnAConfig);

  function checkShouldReplaceDefaultWithStorage(key: QnAConfigKey, storageValue: string | null) {
    if (storageValue && storageValue.length > 0) result[key] = storageValue;
  }

  checkShouldReplaceDefaultWithStorage("knowledgeBaseId", kbId)
  checkShouldReplaceDefaultWithStorage("authEndpointKey", authEndpointKey)
  checkShouldReplaceDefaultWithStorage("qnaMakerServiceName", qnaMakerServiceName)

  return result;
}

export function saveQnAConfig(config: QnAConfig) {
  localStorage.setItem(kbIdKey, config.knowledgeBaseId);
  localStorage.setItem(authEndpointKeyKey, config.authEndpointKey);
  localStorage.setItem(qnaMakerServiceNameKey, config.qnaMakerServiceName);
}
