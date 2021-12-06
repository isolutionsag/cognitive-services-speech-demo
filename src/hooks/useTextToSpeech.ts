import { AudioConfig, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { useState } from "react";
import MySpeechConfig, { isValidSpeechConfig, getSpeechConfigFromMySpeechConfig } from "../models/MySpeechConfig"
import { Voice } from "../util/TextToSpechVoices"

export default function useTextToSpeech(initialText: string, initialVoice: Voice, mySpeechConfig: MySpeechConfig){
    const [isSpeaking, setIsSpeaking] = useState(false);

    function synthesizeSpeech(text: string = initialText, voice: Voice = initialVoice) {
        if (!isValidSpeechConfig(mySpeechConfig)) return;
        const speechConfig = getSpeechConfigFromMySpeechConfig(mySpeechConfig);
        speechConfig.speechSynthesisVoiceName = voice;
        console.log("Synthesizing speech in " + voice + "...");
        setIsSpeaking(true);
        const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
        synthesizer.speakTextAsync(
            text,
          (result) => {
            setTimeout(() => setIsSpeaking(false), text.length * 70); //estimated millis per character to pronounse
            console.log(result);
            if (result) {
              synthesizer.close();
              return result.audioData;
            }
          },
          (error) => {
            setIsSpeaking(false);
            console.log(error);
            synthesizer.close();
          }
        );
      }

    return {
        synthesizeSpeech,
        isSpeaking
    }
}