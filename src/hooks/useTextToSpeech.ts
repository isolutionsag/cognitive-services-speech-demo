import { SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { useRef, useState } from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import { Voice } from "../util/TextToSpechVoices";
import { CreateSpeechSynthesizer } from "../util/SpeechSynthesizerCreator";
import { SpeechServiceLocale } from "../util/SupportedLanguages";

export default function useTextToSpeech(
  initialText: string,
  initialVoice: Voice,
  mySpeechConfig: MySpeechConfig
) {
  const voice = useRef(initialVoice);
  const text = useRef(initialText);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  function synthesizeSpeech(
    _text: string = text.current,
    _voice: Voice = voice.current
  ) {
    text.current = _text;
    voice.current = _voice;

    if (isSynthesizing) return; //do not start synthesizing new text while still synthesizing, improvement: create a queue of texts?
    let synthesizer: SpeechSynthesizer;
    try {
      synthesizer = CreateSpeechSynthesizer(
        mySpeechConfig,
        SpeechServiceLocale.German_Switzerland,
        voice.current
      );
    } catch (err) {
      console.error("Failed to create speech synthesizer", err);
      return;
    }
    setIsSynthesizing(true);
    synthesizer.speakTextAsync(
      text.current,
      (result) => {
        setTimeout(() => setIsSynthesizing(false), text.current.length * 70); //estimated millis per character to pronounse
        if (result) {
          synthesizer.close();
          return result.audioData;
        }
      },
      (error) => {
        setIsSynthesizing(false);
        console.error(error);
        synthesizer.close();
      }
    );
  }

  return {
    synthesizeSpeech,
    isSynthesizing,
  };
}
