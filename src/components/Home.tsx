import { Grid, Typography } from "@mui/material";
import React from "react";

import UseCaseCard from "./UseCaseCard";
import UseCase from "../util/UseCase";

interface HomeProps {
  useCaseSelected: (useCase: UseCase) => void;
}

const Home: React.FC<HomeProps> = ({ useCaseSelected }) => {
  return (
    <div>
      <Typography variant="h2">Grüezi!</Typography>
      <Typography variant="body1">
        Hey, ich bin Leni. Ich bin ein Demo-Bot, der Schweizerdeutsch versteht
        und spricht.
      </Typography>
      <Grid container direction="row" alignItems="center" justifyContent="center" mb={4}>
        <Grid item xs={12} md="auto">
          <Typography variant="body1" textAlign="center">
            Mit mir kannst du die Möglichkeiten der Microsoft Azure Cognitive
            Services ausprobieren.
          </Typography>
        </Grid>
        <Grid item xs={12} md="auto">
          <img
            className="Microsoft-Logo"
            src="images/RWCZER.webp"
            alt="Microsoft"
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="images/isolution_zrh_innenarchitektur-86.jpg"
            imageAlt="translate symbol with swiss flag"
            title="Übersetzung ins Schweizerdeutsche"
            details="Sprich mit mir Englisch, Französisch, Italienisch oder Spanisch und ich übersetze es ins Schweizerdeutsche.​"
            useCase={UseCase.FourLangToSwissTranslation}
            onSelected={useCaseSelected}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="images/isolution_zrh_innenarchitektur-102.jpg"
            imageAlt="Bot icon with several language symbols"
            title="Mehrsprachiger Chat"
            details="Stelle mir Fragen und ich beantworte Sie dir auf Schweizerdeutsch."
            useCase={UseCase.BotChat}
            onSelected={useCaseSelected}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="images/isolution_zrh_innenarchitektur-31.jpg"
            imageAlt="Recycling icon with several language symbols"
            title="Diktiergerät mit Übersetzung"
            details="Diktiere auf Schweizerdeutsch und ich übersetze direkt."
            useCase={UseCase.RealtimeTranscription}
            onSelected={useCaseSelected}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="images/isolution_zrh_innenarchitektur-100.jpg"
            imageAlt="News Icon with 3 lines symbolyzing summary"
            title="News vorlesen lassen​"
            details="Suche die aktuellsten News und ich lese sie dir bei Bedarf vor.​"
            useCase={UseCase.NewsReader}
            onSelected={useCaseSelected}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
