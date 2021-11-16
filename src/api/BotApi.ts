import { createPostRequest } from "./ApiUtil";
import QnAConfig from "../models/QnAConfig";

export async function makeBotRequest(
  question: string,
  config: QnAConfig
): Promise<BotResponse> {
  console.log("makeBotRequest");
  let requestOptions = createPostRequest(
    {
      question: question,
    },
    "application/json",
    `EndpointKey ${config.authEndpointKey}`
  );

  let response: BotResponse;
  try {
    const result = await fetch(
      getRequestUrl(config.botName, config.knowledgeBaseId),
      requestOptions
    );
    response = await result.json();
  } catch (err) {
    response = { error: "Failed to get answer from Bot Api" };
  }
  return response;
}

function getRequestUrl(botName: string, kbId: string) {
  return `https://${botName}.azurewebsites.net/qnamaker/knowledgebases/${kbId}/generateAnswer`;
}

interface BotResponse {
  error?: string;
  answers?: string[];
}
