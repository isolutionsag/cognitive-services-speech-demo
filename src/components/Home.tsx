import {Box, Grid, Typography} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import UseCaseCard from "./UseCaseCard";
import UseCase from "../util/UseCase";
import Image1 from "../assets/isolution_zrh_innenarchitektur-86.jpg";
import Image2 from "../assets/isolution_zrh_innenarchitektur-102.jpg";
import Image3 from "../assets/isolution_zrh_innenarchitektur-31.jpg";
import Image4 from "../assets/isolution_zrh_innenarchitektur-100.jpg";

const Home: React.FC = () => {
    return (
        <>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom="2rem">
                <Typography variant="h2">Grüezi</Typography>
                <Typography variant="h6" component="h1">
                    Ich bin Leni! Eine neurale Stimme, die Schweizerdeutsch versteht
                    und spricht.
                </Typography>
                <Typography variant="body1">
                    Mit mir kannst du die Möglichkeiten der Microsoft Azure Cognitive
                    Services ausprobieren.
                </Typography>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Link to="/translate">
                        <UseCaseCard
                            image={Image1}
                            imageAlt="translate symbol with swiss flag"
                            title="Übersetzung ins Schweizerdeutsche"
                            details="Sprich mit mir Englisch, Französisch, Italienisch oder Spanisch und ich übersetze es ins Schweizerdeutsche.​"
                            useCase={UseCase.FourLangToSwissTranslation}
                        />
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="/chat">
                        <UseCaseCard
                            image={Image2}
                            imageAlt="Bot icon with several language symbols"
                            title="Mehrsprachiger Chat"
                            details="Stelle mir Fragen und ich beantworte Sie dir auf Schweizerdeutsch."
                            useCase={UseCase.BotChat}
                        />
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="/transcription">
                        <UseCaseCard
                            image={Image3}
                            imageAlt="Recycling icon with several language symbols"
                            title="Diktiergerät mit Übersetzung"
                            details="Diktiere auf Schweizerdeutsch und ich übersetze direkt."
                            useCase={UseCase.RealtimeTranscription}
                        />
                    </Link>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Link to="newsreader">
                        <UseCaseCard
                            image={Image4}
                            imageAlt="News Icon with 3 lines symbolyzing summary"
                            title="News vorlesen lassen​"
                            details="Suche die aktuellsten News und ich lese sie dir bei Bedarf vor.​"
                            useCase={UseCase.NewsReader}
                        />
                    </Link>
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
