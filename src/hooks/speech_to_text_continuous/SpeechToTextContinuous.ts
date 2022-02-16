import {
  CancellationReason,
  ResultReason,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import MySpeechConfig from "../../models/MySpeechConfig";
import { CreateSpeechRecognizerSingleLanguage } from "../../util/SpeechRecognizerCreator";
import {
  SpeechServiceLocale,
  SpeechTranslationLanguage,
} from "../../util/SupportedLanguages";
import { CreateTranslator } from "../../util/TranslationRecognizerCreator";

export enum ErrorReason {
  /**
   * An internal error in SpeechToTextContinuous occured
   */
  InternalError,
  /**
   * The provided speech config is invalid
   */
  InvalidConfig,
  /**
   * The SpeechToText sdk canceled the recognition
   */
  SdkCancel,
  /**
   * There was an error in the SpeechToText sdk
   */
  SdkError,
}

export class SpeechToTextContinuous {
  private recognizer?: TranslationRecognizer;

  constructor(private mySpeechConfig: MySpeechConfig) {}

  // returns words understood, no punctuation
  recognizing: (recognizing: string, translating: string) => void = (
    r,
    t
  ) => {};

  // return whole sentences with punctuation.
  recognized: (recognized: string, translated: string) => void = (r, t) => {};

  error: (error: string, reason: ErrorReason) => void = (e, r) => {};

  private initRecognizer(
    recognitionLanguage: SpeechServiceLocale,
    translationLanguage: SpeechTranslationLanguage
  ) {
    try {
      this.recognizer = CreateTranslator(
        this.mySpeechConfig,
        recognitionLanguage,
        translationLanguage
      );
    } catch (e) {
      this.stopRecognition();
      this.error(
        "Error creating speech recognizer: " + e,
        ErrorReason.InvalidConfig
      );
    }
  }

  startRecognition(
    recognitionLanguage: SpeechServiceLocale,
    translationLanguage: SpeechTranslationLanguage
  ) {
    if (!this.recognizer) {
      this.initRecognizer(recognitionLanguage, translationLanguage);
    } else {
      if (
        this.recognizer.speechRecognitionLanguage != recognitionLanguage ||
        !this.recognizer.targetLanguages.includes(translationLanguage)
      ) {
        this.stopRecognition();
        this.initRecognizer(recognitionLanguage, translationLanguage);
      }
    }

    if (!this.recognizer) {
      this.stopRecognition();
      this.error(
        "Speech recognizer not initalized yet.",
        ErrorReason.InternalError
      );
      return;
    }

    this.recognizer.startContinuousRecognitionAsync();

    this.recognizer.recognizing = (s, e) => {
      if (e.result.reason === ResultReason.TranslatingSpeech) {
        this.recognizing(
          e.result.text,
          e.result.translations.get(translationLanguage)
        );
      }
    };

    this.recognizer.recognized = (s, e) => {
      if (e.result.reason === ResultReason.TranslatedSpeech) {
        this.recognized(
          e.result.text,
          e.result.translations.get(translationLanguage)
        );
      }
    };

    this.recognizer.canceled = (s, e) => {
      this.stopRecognition();
      if (e.reason === CancellationReason.Error) {
        this.error(
          `CANCELED (recognition):  Reason=${e.reason} ErrorCode=${e.errorCode}, ErrorDetails=${e.errorDetails}. Have you configured everything correctly?`,
          ErrorReason.SdkCancel
        );
      } else {
        this.error(
          `CANCELED(recognition): Reason=${e.reason}`,
          ErrorReason.SdkCancel
        );
      }
    };
  }

  stopRecognition() {
    if (!this.recognizer) return;
    this.recognizer.stopContinuousRecognitionAsync(
      () => {},
      (e) => {
        this.error("Failed to stop recognition: " + e, ErrorReason.SdkError);
      }
    );
  }

  closeRecognizer() {
    this.stopRecognition();
    this.recognizer?.close();
    this.recognizer = undefined;
  }
}
