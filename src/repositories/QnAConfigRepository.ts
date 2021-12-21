import QnAConfig, { DefaultQnAConfig } from "../models/QnAConfig";

const kbIdKey = "knowledgeBase";
const authEndpointKeyKey = "authEndpointKey";
const qnaMakerServiceNameKey = "qnaMakerServicename";

export function loadQnAConfig(): QnAConfig {
  var kbId = localStorage.getItem(kbIdKey);
  var authEndpointKey = localStorage.getItem(authEndpointKeyKey);
  var botName = localStorage.getItem(qnaMakerServiceNameKey);

  let result = DefaultQnAConfig;

  if (kbId) result.knowledgeBaseId = kbId;
  if (authEndpointKey) result.authEndpointKey = authEndpointKey;
  if (botName) result.qnaMakerServiceName = botName;
  return result;
}

export function saveQnAConfig(config: QnAConfig) {
  localStorage.setItem(kbIdKey, config.knowledgeBaseId);
  localStorage.setItem(authEndpointKeyKey, config.authEndpointKey);
  localStorage.setItem(qnaMakerServiceNameKey, config.qnaMakerServiceName);
}
