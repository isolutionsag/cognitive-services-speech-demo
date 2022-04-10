import { Voice } from "../util/TextToSpechVoices";

interface SpeechComponentProps {
  synthesizeSpeech: (
    text?: string,
    voice?: Voice
  ) => void;
  isSynthesizing: boolean;
}

export default SpeechComponentProps;
