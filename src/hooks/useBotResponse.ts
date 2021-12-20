import { useEffect, useState } from "react";
import { makeBotRequest } from "../api/BotApi";
import QnAConfig from "../models/QnAConfig";

export default function useBotResponse(question: {text: string}, config: QnAConfig) {
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const getBotAnswer = async () => {
      setAnswer("")
      setIsFetching(true)
      setIsSuccess(false)

      if(question.text === ""){
        setAnswer("");
        return
      }

      const botResponse = await makeBotRequest(question.text, config);
      setIsFetching(false);

      const handleResponseSuccess = () => {
        const answer = (botResponse as any).answers[0].answer as string;
        console.log("Bot answer: ", answer);
        setIsSuccess(true);
        setAnswer(answer);
      }

      const handleFailure = (e: any) => {
        console.log("Bot response failed: ", e);
        setError("Bot response failed: " + JSON.stringify(e));
        setIsSuccess(false);
      }

      if(botResponse.error) handleFailure(botResponse.error);
      else{
        try {
          handleResponseSuccess();
        } catch (e) {
          handleFailure(e);
        }
      }
    };
    getBotAnswer();
  }, [question]);

  return {
    isFetching,
    isSuccess,
    error,
    answer,
  };
}
