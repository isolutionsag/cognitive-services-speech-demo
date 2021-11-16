import { createPostRequest } from "./ApiUtil";

const KB_id = "748a9cd7-6acb-43aa-abdb-15c0a9118679";
const AuthEndpointKey = " 47778641-988a-4ca7-939c-05fbdbfd07a4";
const BotName = "chitchatdemobot";

export async function makeBotRequest(
  question: string,
  kbId: string = KB_id,
  authEndpointKey: string = AuthEndpointKey
): Promise<BotResponse> {
  console.log("makeBotRequest");
  let requestOptions = createPostRequest(
    {
      question: question,
    },
    "application/json",
    `EndpointKey ${authEndpointKey}`
  );

  const result = await fetch(getRequestUrl(BotName, kbId), requestOptions);
  const resData = result.json();
  if (resData === null || resData === undefined)
    return { error: "Failed to get answer from api bot" };
  return resData;
}

function getRequestUrl(botName: string, kbId: string) {
  return `https://${botName}.azurewebsites.net/qnamaker/knowledgebases/${kbId}/generateAnswer`;
}

interface BotResponse {
  error?: string;
  answers?: string[];
}
