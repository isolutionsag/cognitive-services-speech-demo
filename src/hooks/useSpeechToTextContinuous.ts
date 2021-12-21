import MySpeechConfig, { isValidSpeechConfig } from "../models/MySpeechConfig";
import {
  CancellationReason,
  ResultReason,
  SpeechRecognizer,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import { CreateTranslator } from "../util/TranslationRecognizerCreator";
import {
  SpeechServiceLocale,
  SpeechTranslationLanguage,
} from "../util/SupportedLanguages";
import useTooltip from "./useTooltip";
import { useDebouncedValue, useDidUpdate } from "rooks";
import { CreateSpeechRecognizerSingleLanguage } from "../util/SpeechRecognizerCreator";

const speechRecognitionLanguage = SpeechServiceLocale.German_Switzerland;

const autoStopRecognitionTimeout = 30 * 1000; //millis

export default function useSpeechToTextContinuous(
  mySpeechConfig: MySpeechConfig
) {
  const [, setIsSuccess] = useState(true);
  const [error, setError] = useState("");

  const [recognizedText, setRecognizedText] = useState(
    "...speak to your microphone..."
  );

  const [recognizingText, setRecognizingText] = useState("... i do listen ...");
  const [debouncedRecognizingTextDebounced] = useDebouncedValue(
    recognizingText,
    autoStopRecognitionTimeout
  );

  const recognizer = useRef<SpeechRecognizer>();

  const [translatedText, setTranslatedText] = useState<string>("...");
  const [translatingText, setTranslatingText] = useState<string>("...");
  const [debouncedTranslatingTextDebounced] = useDebouncedValue(
    recognizingText,
    autoStopRecognitionTimeout
  );

  const translator = useRef<TranslationRecognizer>();
  const [translationTargetLanguage, setTranslationTargetLanguage] = useState(
    SpeechTranslationLanguage.English
  );

  const [isRecognizing, setIsRecognizing] = useState(false);

  const stopRecognitionBecauseTimeoutToolTip = useTooltip(
    `Stopped recognition because there was no input for ${
      autoStopRecognitionTimeout / 1000
    } seconds`
  );

  useEffect(() => {
    if (isValidSpeechConfig(mySpeechConfig)) {
      if (!recognizer.current) {
        try {
          recognizer.current = CreateSpeechRecognizerSingleLanguage(
            mySpeechConfig,
            speechRecognitionLanguage
          );
        } catch (e) {
          setError("Error creating speech recognizer: " + e);
        }
      }

      if (!translator.current) {
        try {
          translator.current = CreateTranslator(
            mySpeechConfig,
            speechRecognitionLanguage,
            translationTargetLanguage
          );
        } catch (e) {
          setError("Error creating speech translator: " + e);
        }
      }
    } else {
      setError(
        "To use the speech to speech service, please configure your keys of the azure speech service first"
      );
      setIsSuccess(false);
    }
  }, [mySpeechConfig, translationTargetLanguage]);

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

  useDidUpdate(() => {
    if (!isRecognizing) return;
    //No recognition input for {autoStopRecognitionTimeout / 1000} seconds
    sttFromMicStop();
    stopRecognitionBecauseTimeoutToolTip.handleOpen();
  }, [debouncedRecognizingTextDebounced, debouncedTranslatingTextDebounced]);

  function sttFromMic() {
    setIsRecognizing(true);

    resetListeners();

    recognizer.current?.startContinuousRecognitionAsync();
    translator.current?.startContinuousRecognitionAsync();
  }

  async function sttFromMicStop() {
    recognizer.current?.stopContinuousRecognitionAsync();
    translator.current?.stopContinuousRecognitionAsync();

    setRecognizingText("...");
    setRecognizedText("...");
    setTranslatedText("...");
    setTranslatingText("...");

    setIsRecognizing(false);
  }

  function resetListeners() {
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

    recognizer.current.canceled = (s, e) => {
      if (e.reason === CancellationReason.Error) {
        setError(
          `CANCELED: Reason=${e.reason} ErrorCode=${e.errorCode}, ErrorDetails=${e.errorDetails}. Have you configured everything correctly?`
        );
      } else {
        setError(`CANCELED: Reason=${e.reason}`);
      }
      sttFromMicStop();
    };
    recognizer.current.sessionStopped = (s, e) => {
      sttFromMicStop();
    };
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
    error,
    stopRecognitionBecauseTimeoutToolTip,
  };
}
