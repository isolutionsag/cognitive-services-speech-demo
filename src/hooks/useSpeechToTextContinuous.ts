import MySpeechConfig, {
  getSpeechConfigFromMySpeechConfig,
  isValidSpeechConfig,
} from "../models/MySpeechConfig";
import {
  AudioConfig,
  ResultReason,
  SpeechRecognizer,
  SpeechTranslationConfig,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import Language, {
  InputLanguageLocale,
  OutputLanguageLocale,
} from "../util/Language";
import { CreateTranslator } from "../util/TranslationRecognizerCreator";
import {
  SpeechServiceLocale,
  SpeechTranslationLanguage,
} from "../util/SupportedLanguages";
import { useDidUpdate } from "rooks";

const speechRecognitionLanguage = SpeechServiceLocale.German_Switzerland;

export default function useSpeechToTextContinuous(
  mySpeechConfig: MySpeechConfig
) {
  const [isSuccess, setIsSuccess] = useState(true);
  const [error, setError] = useState("");

  const [recognizedText, setRecognizedText] = useState(
    "...speak to your microphone..."
  );
  const [recognizingText, setRecognizingText] = useState("... i do listen ...");
  const recognizer = useRef<SpeechRecognizer>();

  const [translatedText, setTranslatedText] = useState<string>("...");
  const [translatingText, setTranslatingText] = useState<string>("...");
  const translator = useRef<TranslationRecognizer>();
  const [translationTargetLanguage, setTranslationTargetLanguage] = useState(
    SpeechTranslationLanguage.English
  );

  const [isRecognizing, setIsRecognizing] = useState(false);

  const speechConfig = getSpeechConfigFromMySpeechConfig(mySpeechConfig);

  useEffect(() => {
    if (isValidSpeechConfig(mySpeechConfig)) {
      if (recognizer.current === undefined) {
        speechConfig.speechRecognitionLanguage = speechRecognitionLanguage;
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        recognizer.current = new SpeechRecognizer(speechConfig, audioConfig);
      }

      if (translator.current === undefined)
        translator.current = CreateTranslator(
          mySpeechConfig,
          speechRecognitionLanguage,
          translationTargetLanguage
        );

      console.log("Created translator: ", translator.current);
    } else {
      setError(
        "To use the speech to speech service, please configure your keys of the azure speech service first"
      );
      setIsSuccess(false);
    }
  }, [mySpeechConfig]);

  useDidUpdate(() => {
    if (translator.current !== undefined) {
      sttFromMicStop();
      translator.current = CreateTranslator(
        mySpeechConfig,
        speechRecognitionLanguage,
        translationTargetLanguage
      );
      sttFromMic();
    }
  }, [translationTargetLanguage]);

  function sttFromMic() {
    setIsRecognizing(true);
    if (!recognizer.current || !translator.current) return;

    // returns words understood, no punctuation
    recognizer.current.recognizing = (s, e) => {
      if (e.result.reason === ResultReason.RecognizingSpeech) {
        setRecognizingText(e.result.text);
      }
    };

    // return whole sentences with punctuation.
    recognizer.current.recognized = (s, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        setRecognizedText(e.result.text);
      }
    };

    //translates words, no punctuation
    translator.current.recognizing = (s, e) => {
      if (e.result.reason === ResultReason.TranslatingSpeech) {
        setTranslatingText(
          e.result.translations.get(translationTargetLanguage)
        );
      }
    };

    //translates whole sentences with punctuation.
    translator.current.recognized = (s, e) => {
      if (e.result.reason === ResultReason.TranslatedSpeech) {
        setTranslatedText(e.result.translations.get(translationTargetLanguage));
      }
    };

    console.log("Starting recognition");
    recognizer.current.startContinuousRecognitionAsync();
    translator.current.startContinuousRecognitionAsync();
  }

  async function sttFromMicStop() {
    console.log("Ending recognition");
    recognizer.current?.stopContinuousRecognitionAsync();
    translator.current?.stopContinuousRecognitionAsync();

    setRecognizingText("...");
    setRecognizedText("...");
    setTranslatedText("...");
    setTranslatingText("...");

    setIsRecognizing(false);
  }

  return {
    recognizedText,
    recognizingText,
    translatingText,
    translatedText,
    translationTargetLanguage,
    setTranslationTargetLanguage,
    isRecognizing,
    sttFromMic,
    sttFromMicStop,
  };
}
