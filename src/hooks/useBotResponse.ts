import { useEffect, useState } from "react";
import { makeBotRequest } from "../api/BotApi";

export default function useBotResponse(question: string) {
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const getBotAnswer = async () => {
      setIsFetching(true)
      setIsSuccess(false)
      const botResponse = await makeBotRequest(question);
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
