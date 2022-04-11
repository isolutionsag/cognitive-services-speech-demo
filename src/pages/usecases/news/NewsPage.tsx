import {
    List,
    Stack,
    Typography,
} from "@mui/material";
import React, {useState, useRef, useEffect} from "react";
import {UseCaseTemplateChildProps} from "../UseCaseTemplate";
import NewsSearch from "./NewsSearch";
import NewsItemRow from "./NewsItemRow";
import Synthesizer from "../../../services/Synthesizer";
import SpeechServiceConfiguration from "../../../models/SpeechServiceConfiguration";
import BingSearchConfig from "../../../models/BingSearchConfig";

const {CognitiveServicesCredentials} = require("@azure/ms-rest-azure-js");
const {NewsSearchClient} = require("@azure/cognitiveservices-newssearch");

interface NewsPageProps extends UseCaseTemplateChildProps {
    speechConfig: SpeechServiceConfiguration;
    bingSearchConfig: BingSearchConfig;
}

interface NewsItem {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    datePublished: Date;
}

const NewsPage: React.FC<NewsPageProps> = ({
                                               setError,
                                               speechConfig,
                                               bingSearchConfig,
                                           }) => {
    const credentials = new CognitiveServicesCredentials(
        bingSearchConfig.subscriptionKey
    );
    const [synthesizingNewsItem, setSynthesizingNewsItem] = useState<NewsItem>();
    const newsSearchClient = useRef(new NewsSearchClient(credentials));
    const [news, setNews] = useState<NewsItem[]>([]);
    const synthesizeNewsItem = (newsItem: NewsItem) => {
        if (synthesizingNewsItem) {
            return;
        }

        setSynthesizingNewsItem(newsItem);
        speechSynthesizer.current.speak(`${newsItem.title}. ${newsItem.description}`)
            .finally(() => {
                setSynthesizingNewsItem(undefined);
            });
    }

    const speechSynthesizer = useRef<Synthesizer>(new Synthesizer(speechConfig));

    useEffect(() => {
        if (speechSynthesizer.current?.isDisposed) {
            speechSynthesizer.current = new Synthesizer(speechConfig);
        }

        return () => {
            speechSynthesizer.current.dispose();
        }
    }, [speechConfig])

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
                        isPlaying={(() => synthesizingNewsItem == item)()}
                        isDisabled={!!synthesizingNewsItem}
                    />
                ))}
                {news.length === 0 && (
                    <Typography variant="subtitle1">Keine Suchergebisse</Typography>
                )}
            </List>
        </Stack>
    );
};

export default NewsPage;
