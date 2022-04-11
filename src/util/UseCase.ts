enum UseCase {
  FourLangToSwissTranslation = "fourLangToSwissTranslation",
  BotChat = "botChat",
  RealtimeTranscription = "realtimeTranscription",
  NewsReader = "newsReader",
}

export interface UseCaseModel {
  title: string;
  description: string;
}

export const UseCaseModels: { [key in UseCase]: UseCaseModel } = {
  [UseCase.FourLangToSwissTranslation]: {
    title: "Übersetzung ins Schweizerdeutsche",
    description:
      "Sag etwas auf Englisch, Französisch, Italienisch oder Spanisch und lass dir die Übersetzung auf Schweizerdeutsch vorlesen.",
  },
  [UseCase.BotChat]: {
    title: "Mehrsprachiger Chatbot",
    description: `Sprich mit mir und du erhälst eine kluge Antwort`,
  },
  [UseCase.RealtimeTranscription]: {
    title: "Diktiergerät mit Übersetzung",
    description: "Diktiere in deiner gewünschten Sprache und ich transkribiere es in Echtzeit in die Zielsprache.",
  },
  [UseCase.NewsReader]: {
    title: "Nachrichten vorlesen",
    description:
      "Hier kannst du nach einem Thema suchen und dir die Nachrichten vorlesen lassen.",
  },
};

export default UseCase;
