import MySpeechConfig from "../../models/MySpeechConfig";
import { Button, TextField, Typography } from "@mui/material";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import { Voice } from "../../util/TextToSpechVoices";
import React, { useState } from "react";

const { CognitiveServicesCredentials } = require('@azure/ms-rest-azure-js');
const { NewsSearchClient } = require('@azure/cognitiveservices-newssearch');

interface NewsReaderProps {
    speechConfig: MySpeechConfig
}

const NewsReader: React.FC<NewsReaderProps> = ({speechConfig}) => {

    const credentials = new CognitiveServicesCredentials('80ccba9bfd824237a366492e732d6107');
    const newsSearchClient = new NewsSearchClient(credentials);
    const {synthesizeSpeech, isSynthesizing} = useTextToSpeech("", Voice.de_CH_LeniNeural, speechConfig)
    
    const [topic, setTopic] = useState("Skirennen");
    const [news, setNews] = useState("");

    const onChangeTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopic(event.target.value)
      }
      
    const searchNews = async () => {
        let newsResults = await newsSearchClient.news.search(topic, {
            market: "de-ch",
            acceptLanguage: "de-de",
            count: 3
          });
          console.log(newsResults);
          setNews(newsResults.value[0].description);
          synthesizeSpeech(newsResults.value[0].description);
    };

    return (<div>
        <Typography variant="h4" >
            Latest News by Leni
        </Typography>
        
        <TextField id="standard-basic" label="News Topic" variant="standard" value={topic} onChange={onChangeTopic} size="medium" />
        <br/><br/>
        <Button onClick={() => searchNews()} variant="contained" color="secondary">Vorlesen</Button>
        <br/>
        <Typography variant="body1" >
            {news}
        </Typography>
    </div>
    );
}
 
export default NewsReader;