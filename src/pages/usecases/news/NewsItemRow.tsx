import React from "react";
import {Avatar, Button, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

interface NewsItem {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    datePublished: Date;
}

interface NewsItemRowProps {
    item: NewsItem;
    isPlaying: boolean;
    play: () => void;
}

const NewsItemRow : React.FC<NewsItemRowProps> = ({item, isPlaying, play}) => {
  return (
      <ListItem alignItems="flex-start">
          <ListItemAvatar>
              <Avatar
                  sx={{width: 100, height: 100}}
                  alt="News thumbnail"
                  src={item.thumbnail}
              />
          </ListItemAvatar>
          <ListItemText
              style={{marginLeft: "20px"}}
              primary={item.title}
              secondary={
                  <>
                      <Typography
                          sx={{display: "block"}}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                      >
                          {item.description}
                      </Typography>
                      {`— ${item.datePublished.toDateString()}`}
                  </>
              }
          />
          <ListItemIcon>
              <div style={{maxWidth: "150px"}}>
                  <Button href={item.url} target="_blank" rel="noopener" fullWidth startIcon={<LinkIcon/>}>
                      Seite öffnen
                  </Button>
                  <Button
                      disabled={isPlaying}
                      variant="contained"
                      fullWidth
                      onClick={play}
                  >
                      {isPlaying ? "Wird Vorgelesen..." : "Vorlesen"}
                  </Button>
              </div>
          </ListItemIcon>
      </ListItem>
  );
};

export default NewsItemRow;