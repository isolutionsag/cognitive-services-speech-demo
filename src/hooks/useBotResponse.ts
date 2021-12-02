import { useEffect, useState } from "react";
import { makeBotRequest } from "../api/BotApi";
import QnAConfig from "../models/QnAConfig";

export default function useBotResponse(question: {text: string}, config: QnAConfig) {
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const getBotAnswer = async () => {
      setAnswer("")
      setIsFetching(true)
      setIsSuccess(false)
      const botResponse = await makeBotRequest(question.text, config);
      setIsFetching(false);
      try {
        const answer = (botResponse as any).answers[0].answer as string;
        console.log("Bot answer: ", answer);
        setIsSuccess(true);
        setAnswer(answer);
      } catch (e) {
        console.log("Bot response failed: ", e);
        setIsSuccess(false);
      }
    };
    getBotAnswer();
  }, [question]);

  return {
    isFetching,
    isSuccess,
    answer,
  };
}
