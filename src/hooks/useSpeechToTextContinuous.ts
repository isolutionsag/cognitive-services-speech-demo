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

const autoStopRecognitionTimeout = 30 * 1000; //millis

type useSpeechToTextContinuousType = typeof useSpeechToTextContinuous;
export type SpeechToTextContinuous = ReturnType<useSpeechToTextContinuousType>;

export default function useSpeechToTextContinuous(
  mySpeechConfig: MySpeechConfig,
  initialSpeechRecognitionLanguage: SpeechServiceLocale
) {
  const [, setIsSuccess] = useState(true);
  const [error, setError] = useState("");

  const [recognitionLanguage, setRecognitionLanguage] = useState(
    initialSpeechRecognitionLanguage
  );

  const [recognizedText, setRecognizedText] = useState("");

  const [recognizingText, setRecognizingText] = useState("");
  const [debouncedRecognizingTextDebounced] = useDebouncedValue(
    recognizingText,
    autoStopRecognitionTimeout
  );

  const recognizer = useRef<SpeechRecognizer>();

  const [translatedText, setTranslatedText] = useState<string>("");
  const [translatingText, setTranslatingText] = useState<string>("");
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
    `Aufnahme gestoppt, wegen Inaktivität für ${
      autoStopRecognitionTimeout / 1000
    } Sek`
  );

  useEffect(() => {
    if (!isValidSpeechConfig(mySpeechConfig)) {
      setError(
        "To use the speech to speech service, please configure your keys of the azure speech service first"
      );
      setIsSuccess(false);
      return;
    }
    const wasRecognizing = isRecognizing;
    try {
      // stop prev recognizer instance before recreating
      // (otherwise will listen until page refreshed => uses unnecessary resources)
      sttFromMicStop();
    } catch (err) {
      return; //do not recreate recognizer if failed to stop previous recognizer
    }
    try {
      recognizer.current = CreateSpeechRecognizerSingleLanguage(
        mySpeechConfig,
        recognitionLanguage
      );
    } catch (e) {
      setError("Error creating speech recognizer: " + e);
    }
    try {
      translator.current = CreateTranslator(
        mySpeechConfig,
        recognitionLanguage,
        translationTargetLanguage
      );
    } catch (e) {
      setError("Error creating speech translator: " + e);
    }
    if (wasRecognizing) sttFromMic();
  }, [mySpeechConfig, translationTargetLanguage, recognitionLanguage]);

  useDidUpdate(() => {
    if (translator.current !== undefined) {
      sttFromMicStop();
      translator.current = CreateTranslator(
        mySpeechConfig,
        recognitionLanguage,
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

    setRecognizingText("");
    setRecognizedText("");
    setTranslatedText("");
    setTranslatingText("");

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
          `CANCELED (recognition):  Reason=${e.reason} ErrorCode=${e.errorCode}, ErrorDetails=${e.errorDetails}. Have you configured everything correctly?`
        );
      } else {
        setError(`CANCELED(recognition): Reason=${e.reason}`);
      }
      sttFromMicStop();
    };

    translator.current.canceled = (s, e) => {
      if (e.reason === CancellationReason.Error) {
        setError(
          `CANCELED (translation recognition): Reason=${e.reason} ErrorCode=${e.errorCode}, ErrorDetails=${e.errorDetails}. Have you configured everything correctly?`
        );
      } else {
        setError(`CANCELED (translation recognition): Reason=${e.reason}`);
      }
      sttFromMicStop();
    };
  }

  return {
    recognizedText,
    recognizingText,
    translatingText,
    translatedText,
    recognitionLanguage,
    setRecognitionLanguage,
    translationTargetLanguage,
    setTranslationTargetLanguage,
    isRecognizing,
    sttFromMic,
    sttFromMicStop,
    error,
    stopRecognitionBecauseTimeoutToolTip,
  };
}
