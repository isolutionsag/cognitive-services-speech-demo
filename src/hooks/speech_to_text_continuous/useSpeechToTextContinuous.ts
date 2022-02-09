import MySpeechConfig, { isValidSpeechConfig } from "../../models/MySpeechConfig";
import {
  CancellationReason,
  ResultReason,
  SpeechRecognizer,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useRef, useState } from "react";
import { CreateTranslator } from "../../util/TranslationRecognizerCreator";
import {
  SpeechServiceLocale,
  SpeechTranslationLanguage,
} from "../../util/SupportedLanguages";
import useTooltip from "../useTooltip";
import { useDebouncedValue, useDidUpdate } from "rooks";
import { CreateSpeechRecognizerSingleLanguage } from "../../util/SpeechRecognizerCreator";
import { SpeechToTextContinuous } from "./SpeechToTextContinuous";

const autoStopRecognitionTimeout = 30 * 1000; //millis

//type useSpeechToTextContinuousType = typeof useSpeechToTextContinuous;
//export type SpeechToTextContinuous = ReturnType<useSpeechToTextContinuousType>;

export default function useSpeechToTextContinuous(
  mySpeechConfig: MySpeechConfig,
  initialSpeechRecognitionLanguage: SpeechServiceLocale
) {

  /*

  const [debouncedRecognizingTextDebounced] = useDebouncedValue(
    recognizingText,
    autoStopRecognitionTimeout
  );

  const [translatedText, setTranslatedText] = useState<string>("");
  const [debouncedTranslatingTextDebounced] = useDebouncedValue(
    recognizingText,
    autoStopRecognitionTimeout
  );


  const stopRecognitionBecauseTimeoutToolTip = useTooltip(
    `Aufnahme gestoppt, wegen Inaktivität für ${
      autoStopRecognitionTimeout / 1000
    } Sek`
  );

  useDidUpdate(() => {
    if (!isRecognizing) return;
    //No recognition input for {autoStopRecognitionTimeout / 1000} seconds
    sttFromMicStop();
    stopRecognitionBecauseTimeoutToolTip.handleOpen();
  }, [debouncedRecognizingTextDebounced, debouncedTranslatingTextDebounced]);

  */
}
