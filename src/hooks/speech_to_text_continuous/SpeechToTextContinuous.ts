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
   * TODO
   */
  InternalError,
  InvalidConfig,
  SdkCancel,
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
    console.log(
      "startRecognition with language: " +
        recognitionLanguage +
        ", translation language: " +
        translationLanguage
    );
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
      console.log("Recognizing: ", e.result.text);
      console.log("prev Recognizing: ", e.result);
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
    console.log("Stopping recognition...");
    if (!this.recognizer) return;
    this.recognizer.stopContinuousRecognitionAsync();
  }
}
