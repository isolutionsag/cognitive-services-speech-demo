import { createPostRequest } from "./ApiUtil";
import { v4 as uuidv4 } from "uuid";

const subscriptionKey = "a4c13ea841b84a6fb5d767016d672520";
const endpoint = "https://api.cognitive.microsofttranslator.com";

// Add your location, also known as region. The default is global
// This is required if using a Cognitive Services resource.
const region = "global";

interface TranslationResponse {
  error?: string;
  translations?: { text: string; to: string }[];
  detectedLanguage?: string;
}

export async function makeTranslationRequest(
  textToTranslate: string,
  fromLanguage: string,
  toLanguages: string[]
): Promise<TranslationResponse> {
  function getRequestOptions() {
    let requestOptions = createPostRequest(
      [{ Text: textToTranslate }],
      "application/json"
    );

    const headers = {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Ocp-Apim-Subscription-Region": region,
      "X-ClientTraceId": uuidv4().toString(),
    };
    requestOptions.headers = headers;
    return requestOptions;
  }

  try {
    const result = await fetch(
      getRequestUrl(fromLanguage, toLanguages),
      getRequestOptions()
    );
    const data = await result.json();
    return {
      translations: data[0].translations,
      detectedLanguage: data[0].detectedLanguage,
    };
  } catch (err) {
    return { error: "Failed to get answer from Bot Api: " + err };
  }
}

function getRequestUrl(from: string, to: string[]) {
  const toParameters = to.reduce((acc, param) => {
    return acc.concat(`&to=${param}`);
  }, "");

  const route = `/translate?api-version=3.0&from=${from}${toParameters}`;
  return `${endpoint}${route}`;
}