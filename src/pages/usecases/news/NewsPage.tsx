import {
    List,
    Stack,
    Typography,
} from "@mui/material";
import React, {useState, useRef} from "react";
import {loadBingSearchConfig} from "../../../repositories/BingSearchConfigRepository";
import {Voice} from "../../../util/TextToSpechVoices";
import {UseCaseTemplateChildProps} from "../UseCaseTemplate";
import NewsSearch from "./NewsSearch";
import NewsItemRow from "./NewsItemRow";

const {CognitiveServicesCredentials} = require("@azure/ms-rest-azure-js");
const {NewsSearchClient} = require("@azure/cognitiveservices-newssearch");

interface NewsPageProps extends UseCaseTemplateChildProps {
}

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
    const newsSearchClient = useRef(new NewsSearchClient(credentials));
    const [news, setNews] = useState<NewsItem[]>([]);
    const synthesizeNewsItem = (newsItem: NewsItem) => {
        synthesizeSpeech(`${newsItem.title}. ${newsItem.description}`, Voice.de_CH_LeniNeural);
    }

    const searchNews = async (newsTopic: string) => {
        try {
            const newsResults = await newsSearchClient.current.news.search(newsTopic, {
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
        <Stack display="flex" alignItems="center">
            <NewsSearch search={searchNews}/>
            <List
                sx={{width: "100%"}}
            >
                {news.map((item, i) => (
                    <NewsItemRow
                        item={item}
                        play={() => synthesizeNewsItem(item)}
                        key={i}
                        isPlaying={false} // TODO: Update this!
                    />
                ))}
                {news.length === 0 && (
                    <Typography variant="subtitle1">Keine Suchergebisse</Typography>
                )}
            </List>
        </Stack>
    );
};

// const NewsItemRow: React.FC<{
//     item: NewsItem;
//     index: number;
//     synthesizeNewsItem: (item: NewsItem) => void;
//     isSynthesizing: boolean;
// }> = ({item, index, synthesizeNewsItem, isSynthesizing}) => {
//     const [isItemBeingSynthesized, setIsItemBeingSynthesized] = useState(false);
//
//     useEffect(() => {
//         if (!isSynthesizing) setIsItemBeingSynthesized(false);
//     }, [isSynthesizing]);
//
//     const handleReadNews = () => {
//         synthesizeNewsItem(item);
//         setIsItemBeingSynthesized(true);
//     }
//
//     return (
//         <>
//             <Divider component="li"/>
//             <ListItem alignItems="flex-start">
//                 <ListItemAvatar>
//                     <Avatar
//                         sx={{width: 100, height: 100}}
//                         alt="News thumbnail"
//                         src={item.thumbnail}
//                     />
//                 </ListItemAvatar>
//                 <ListItemText
//                     style={{marginLeft: "20px"}}
//                     primary={item.title}
//                     secondary={
//                         <>
//                             <Typography
//                                 sx={{display: "block"}}
//                                 component="span"
//                                 variant="body2"
//                                 color="text.secondary"
//                             >
//                                 {item.description}
//                             </Typography>
//                             {`— ${item.datePublished.toDateString()}`}
//                         </>
//                     }
//                 />
//                 <ListItemIcon>
//                     <div style={{maxWidth: "150px"}}>
//                         <Button href={item.url} target="_blank" rel="noopener" fullWidth startIcon={<LinkIcon/>}>
//                             Seite öffnen
//                         </Button>
//                         <Button
//                             disabled={isSynthesizing}
//                             variant="contained"
//                             fullWidth
//                             onClick={handleReadNews}
//                         >
//                             {isItemBeingSynthesized ? "Wird Vorgelesen..." : "Vorlesen"}
//                         </Button>
//                     </div>
//                 </ListItemIcon>
//             </ListItem>
//         </>
//     );
// };

export default NewsPage;
