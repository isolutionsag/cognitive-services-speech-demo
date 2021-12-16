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
    [UseCase.FourLangToSwissTranslation]: {title: "Übersetzung ins Schweizerdeutsch",
     description: "Spreche auf Englisch, Französisch, Italienisch oder Spanisch und lass dir die Übersetzung auf Schweizerdeutsch vorlesen."},
    [UseCase.BotChat]: {title: "Mutlilingual chat mit Bot", description: `Clicke auf den "Aufnehmen" Knopf beginne eine Konversation mit dem Bot. Du kannst auf Deutsch, Englisch, Französisch oder Italienisch mit ihm reden.`},
    [UseCase.RealtimeTranscription]: {title: "RealtimeTranscription", 
    description:"Fang einfach an zu reden, auf Schweizer- oder Hochdeutsch, wie du willst..."},
    [UseCase.NewsReader]: {title: "Latest News by Leni", description: "Hier kannst du nach einem Thema suchen und dir die Suchergebnisse vorlesen lassen."}
}

export default UseCase