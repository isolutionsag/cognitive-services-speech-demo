import { SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { useState } from "react";
import MySpeechConfig from "../models/MySpeechConfig";
import { Voice } from "../util/TextToSpechVoices";
import { CreateSpeechSynthesizer } from "../util/SpeechSynthesizerCreator";
import { SpeechServiceLocale } from "../util/SupportedLanguages";

export default function useTextToSpeech(
  initialText: string,
  initialVoice: Voice,
  mySpeechConfig: MySpeechConfig
) {
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  function synthesizeSpeech(
    text: string = initialText,
    voice: Voice = initialVoice
  ) {
    if(isSynthesizing) return; //do not start synthesizing new text while still synthesizing, improvement: create a queue of texts?
    let synthesizer: SpeechSynthesizer;
    try {
      synthesizer = CreateSpeechSynthesizer(
        mySpeechConfig,
        SpeechServiceLocale.German_Switzerland,
        voice
      );
    } catch (err) {
      console.log("Failed to create speech synthesizer", err);
      return;
    }
    console.log("Synthesizing speech in " + voice + "...");
    setIsSynthesizing(true);
    synthesizer.speakTextAsync(
      text,
      (result) => {
        setTimeout(() => setIsSynthesizing(false), text.length * 70); //estimated millis per character to pronounse
        console.log(result);
        if (result) {
          synthesizer.close();
          return result.audioData;
        }
      },
      (error) => {
        setIsSynthesizing(false);
        console.log(error);
        synthesizer.close();
      }
    );
  }

  return {
    synthesizeSpeech,
    isSynthesizing,
  };
}
