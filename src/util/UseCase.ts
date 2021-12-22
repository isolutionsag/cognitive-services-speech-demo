enum UseCase {
    FourLangToSwissTranslation = "fourLangToSwissTranslation",
    BotChat = "botChat",
    RealtimeTranscription = "realtimeTranscription",
    NewsReader = "newsReader",
}

export interface UseCaseModel{
    title: string;
    description: string;
}

export const UseCaseModels: {[key in UseCase]: UseCaseModel} = {
    [UseCase.FourLangToSwissTranslation]: {title: "Übersetzung ins Schweizerdeutsche",
     description: "Sag etwas auf Englisch, Französisch, Italienisch oder Spanisch und lass dir die Übersetzung auf Schweizerdeutsch vorlesen."},
    [UseCase.BotChat]: {title: "Mehrsprachiger Chatbot", description: `Frage mich etwas auf Deutsch, Englisch, Französisch oder Italienisch und lass dir meine Antwort auf Schweizerdeutsch vorlesen.`},
    [UseCase.RealtimeTranscription]: {title: "Diktiergerät mit Übersetzung", 
    description:"Fang einfach an zu reden, auf Schweizer- oder Hochdeutsch, wie du willst..."},
    [UseCase.NewsReader]: {title: "Latest News by Leni", description: "Hier kannst du nach einem Thema suchen und dir die Suchergebnisse vorlesen lassen."}
}

export default UseCase