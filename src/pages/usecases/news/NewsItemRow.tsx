import React from "react";
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText, Tooltip,
    Typography
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import LinkIcon from "@mui/icons-material/Link";
import {Campaign} from "@mui/icons-material";

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
    isDisabled: boolean;
}

const NewsItemRow: React.FC<NewsItemRowProps> = ({item, isPlaying, play, isDisabled}) => {
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
                <LoadingButton
                    disabled={isDisabled}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={play}
                    loading={isPlaying}
                    startIcon={<Campaign/>}
                >
                    Vorlesen
                </LoadingButton>
                <Tooltip title="Seite öffnen">
                    <IconButton aria-label="Open link" color="info" href={item.url} target="_blank" rel="noopener">
                        <LinkIcon/>
                    </IconButton>
                </Tooltip>
            </ListItemIcon>
        </ListItem>
    );
};

export default NewsItemRow;