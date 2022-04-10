import {
  Avatar,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { loadBingSearchConfig } from "../../../repositories/BingSearchConfigRepository";
import { Voice } from "../../../util/TextToSpechVoices";
import { UseCaseTemplateChildProps } from "../UseCaseTemplate";

const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const { NewsSearchClient } = require("@azure/cognitiveservices-newssearch");

interface NewsPageProps extends UseCaseTemplateChildProps {}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  datePublished: Date;
}

const NewsPage: React.FC<NewsPageProps> = ({
  synthesizeSpeech,
  isSynthesizing,
  setError,
}) => {
  const bingConfig = loadBingSearchConfig();
  const credentials = new CognitiveServicesCredentials(
    bingConfig.subscriptionKey
  );
  const newsSearchClient = new NewsSearchClient(credentials);

  const [searchTopic, setSearchTopic] = useState("Skirennen");
  const [news, setNews] = useState<NewsItem[]>([]);

  const onChangeTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTopic(event.target.value);
  };

  function synthesizeNewsItem(newsItem: NewsItem) {
    synthesizeSpeech(`${newsItem.title}. ${newsItem.description}`, Voice.de_CH_LeniNeural);
  }

  const searchNews = async () => {
    try {
      let newsResults = await newsSearchClient.news.search(searchTopic, {
        market: "de-ch",
        acceptLanguage: "de-DE",
        count: 5,
      });
      setNews(
        newsResults.value.map((result: any) => {
          return {
            title: result.name,
            description: result.description,
            url: result.url,
            thumbnail: result.image?.thumbnail?.contentUrl,
            datePublished: new Date(result.datePublished),
          };
        })
      );
    } catch (e) {
      setError(
        "Failed to get news results: " +
          (e as any).message +
          ". Have you entered the correct configuration?"
      );
    }
  };

  return (
    <Grid container justifyContent="center">
      <div style={{ maxWidth: "800px" }}>
        <TextField
          id="standard-basic"
          label="News Topic"
          variant="outlined"
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
              <br />
              <Typography variant="body1">Keine Suchergebisse</Typography>
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
    if (!isSynthesizing && index === 0) handleReadNews();
  }, [item]);

  useEffect(() => {
    if (!isSynthesizing) setIsItemBeingSynthesized(false);
  }, [isSynthesizing]);

  function handleReadNews() {
    synthesizeNewsItem(item);
    setIsItemBeingSynthesized(true);
  }

  return (
    <React.Fragment>
      <Divider component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            sx={{ width: 100, height: 100 }}
            alt="News thumbnail"
            src={item.thumbnail}
          />
        </ListItemAvatar>
        <ListItemText
          style={{ marginLeft: "20px" }}
          primary={item.title}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: "block" }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {item.description}
              </Typography>
              {`— ${item.datePublished.toDateString()}`}
            </React.Fragment>
          }
        />
        <ListItemIcon>
          <div style={{ maxWidth: "150px" }}>
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
        </ListItemIcon>
      </ListItem>
    </React.Fragment>
  );
};

export default NewsPage;
