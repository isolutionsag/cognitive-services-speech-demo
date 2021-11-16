import QnAConfig, { DefaultQnAConfig } from "../models/QnAConfig";

const kbIdKey = "knowledgeBase";
const authEndpointKeyKey = "authEndpointKey";
const botNameKey = "botName";

export function loadQnAConfig(): QnAConfig {
  var kbId = localStorage.getItem(kbIdKey);
  var authEndpointKey = localStorage.getItem(authEndpointKeyKey);
  var botName = localStorage.getItem(botNameKey);

  let result = DefaultQnAConfig;

  if (kbId) result.knowledgeBaseId = kbId;
  if (authEndpointKey) result.authEndpointKey = authEndpointKey;
  if (botName) result.botName = botName;
  return result;
}

export function saveQnAConfig(config: QnAConfig) {
  localStorage.setItem(kbIdKey, config.knowledgeBaseId);
  localStorage.setItem(authEndpointKeyKey, config.authEndpointKey);
  localStorage.setItem(botNameKey, config.botName);
}
