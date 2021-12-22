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

      console.log("Fetching bot response")

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
        if(!botResponse || !botResponse.answers || botResponse.answers.length === 0){
          setAnswer("")
          setIsSuccess(false)
          return
        }

        setIsSuccess(true);
        const answer = botResponse.answers[0].answer  as string;
        setAnswer(answer);
      }

      const handleFailure = (e: any) => {
        console.error("Bot response failed: ", e);
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
