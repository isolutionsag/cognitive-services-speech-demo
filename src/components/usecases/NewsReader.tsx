import MySpeechConfig from "../../models/MySpeechConfig";
import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import { Voice } from "../../util/TextToSpechVoices";
import React, { useState, useEffect } from "react";

const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const { NewsSearchClient } = require("@azure/cognitiveservices-newssearch");

interface NewsReaderProps {
  speechConfig: MySpeechConfig;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
}

const NewsReader: React.FC<NewsReaderProps> = ({ speechConfig }) => {
  const credentials = new CognitiveServicesCredentials(
    "80ccba9bfd824237a366492e732d6107"
  );
  const newsSearchClient = new NewsSearchClient(credentials);
  const { synthesizeSpeech, isSynthesizing } = useTextToSpeech(
    "",
    Voice.de_CH_LeniNeural,
    speechConfig
  );

  const [searchTopic, setSearchTopic] = useState("Skirennen");
  const [news, setNews] = useState<NewsItem[]>([]);

  const onChangeTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTopic(event.target.value);
  };

  function synthesizeNewsItem(newsItem: NewsItem) {
    synthesizeSpeech(`${newsItem.title}. ${newsItem.description}`);
  }

  const searchNews = async () => {
    let newsResults = await newsSearchClient.news.search(searchTopic, {
      market: "de-ch",
      acceptLanguage: "de-de",
      count: 5,
    });
    console.log(newsResults);
    setNews(
      newsResults.value.map((result: any) => {
        return {
          title: result.name,
          description: result.description,
          url: result.url,
        };
      })
    );
  };

  return (
    <Grid container justifyContent="center">
      <div style={{ maxWidth: "800px" }}>
        <Typography variant="h4">Latest News by Leni</Typography>

        <TextField
          id="standard-basic"
          label="News Topic"
          variant="standard"
          value={searchTopic}
          onChange={onChangeTopic}
          size="medium"
        />
        <br />
        <br />
        <Button
          onClick={() => searchNews()}
          variant="contained"
          color="secondary"
        >
          Suchen
        </Button>
        <br />
        <br />
        <List
          sx={{ width: "100%", maxWidth: 800, bgcolor: "background.paper" }}
        >
          {news.map((item, i) => (
            <NewsItemRow
              item={item}
              index={i}
              synthesizeNewsItem={synthesizeNewsItem}
              key={`newsitem_${i}`}
              isSynthesizing={isSynthesizing}
            />
          ))}
          {news.length === 0 && (
            <>
              <Divider component="li" />
              <Typography variant="body1">No Search results</Typography>
            </>
          )}
        </List>
      </div>
    </Grid>
  );
};

const NewsItemRow: React.FC<{
  item: NewsItem;
  index: number;
  synthesizeNewsItem: (item: NewsItem) => void;
  isSynthesizing: boolean;
}> = ({ item, index, synthesizeNewsItem, isSynthesizing }) => {
  const [isItemBeingSynthesized, setIsItemBeingSynthesized] = useState(false);

  useEffect(() => {
    if (!isSynthesizing && index === 0) handleReadNews()
  }, [item])

  useEffect(() => {
    if(!isSynthesizing) setIsItemBeingSynthesized(false)
  }, [isSynthesizing])

  function handleReadNews(){
    synthesizeNewsItem(item)
    setIsItemBeingSynthesized(true)
  }

  return (
    <React.Fragment>
      <Divider component="li" />
      <ListItem alignItems="flex-start" >
        <ListItemText primary={item.title} secondary={item.description} />
        <div
          style={{ display: "inline", minWidth: "130px", marginLeft: "10px" }}
        >
          <Button href={item.url} target="_blank" fullWidth>
            Seite öffnen
          </Button>
          <Button
            disabled={isSynthesizing}
            variant="contained"
            fullWidth
            onClick={handleReadNews}
          >
            {isItemBeingSynthesized ? "Wird Vorgelesen..." : "Vorlesen"}
          </Button>
        </div>
      </ListItem>
    </React.Fragment>
  );
};

export default NewsReader;
