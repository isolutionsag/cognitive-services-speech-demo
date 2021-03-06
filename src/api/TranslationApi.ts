import { createPostRequest } from "./ApiUtil";
import { v4 as uuidv4 } from "uuid";
import TranslatorConfig from "../models/TranslatorConfig";

const endpoint = "https://api.cognitive.microsofttranslator.com";

export interface TranslationResponse {
  error?: string;
  translations?: { text: string; to: string }[];
  detectedLanguage?: string;
}

export async function makeTranslationRequest(
  textToTranslate: string,
  fromLanguage: string,
  toLanguages: string[],
  config: TranslatorConfig
): Promise<TranslationResponse> {
  if (!textToTranslate || textToTranslate === "")
    return {
      translations: toLanguages.map((language) => {
        return {
          text: "",
          to: language,
        };
      }),
    };

  function getRequestOptions() {
    let requestOptions = createPostRequest(
      [{ Text: textToTranslate }],
      "application/json"
    );

    const headers = {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": config.subscriptionKey,
      "Ocp-Apim-Subscription-Region": config.region,
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
    if (!data || data.length === 0)
      return {
        error:
          "No data response from translation API. Response was:  " +
          data.response,
      };
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
