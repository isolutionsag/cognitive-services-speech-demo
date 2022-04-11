import {ResultReason, SpeechSynthesizer as AzureSynthesizer} from "microsoft-cognitiveservices-speech-sdk";
import {CreateSpeechSynthesizer} from "../util/SpeechSynthesizerCreator";
import SpeechServiceConfiguration from "../models/SpeechServiceConfiguration";
import {SpeechServiceLocale} from "../util/SupportedLanguages";
import {Voice} from "../util/TextToSpechVoices";

export default class Synthesizer {
    public isDisposed = false;
    private synthesizer: AzureSynthesizer;
    
    constructor(speechConfiguration: SpeechServiceConfiguration) {
        this.synthesizer = CreateSpeechSynthesizer(speechConfiguration,
            SpeechServiceLocale.German_Switzerland,
            Voice.de_CH_LeniNeural);
    }
    
    public speak(text: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.synthesizer.speakTextAsync(text, () => {
                setTimeout(() => resolve(), text.length * 70);
            });
        });
    }
    
    public dispose() {
        this.isDisposed = true;
        this.synthesizer.close();
    }
}