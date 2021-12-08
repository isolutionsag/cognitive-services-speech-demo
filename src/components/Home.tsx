import {
  Grid,
  Typography,
} from "@mui/material";
import React, {  } from "react";

import UseCaseCard from "./UseCaseCard";
import UseCase from "../util/UseCase";

interface HomeProps {
  useCaseSelected: (useCase: UseCase) => void;
}

const Home: React.FC<HomeProps> = ({ useCaseSelected }) => {
  return (
    <div>
      <h1>Hi there!</h1>
      <Typography variant="body1" gutterBottom mb={4}>
        {
          "Try out our speech, QnA Maker and translation services / Hey, ich bin die Leni! Hier kannst Du mit mir schwätzen, Videos in Realtime transkribieren und mehr"
        }
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="todo"
            imageAlt="Bot icon with several language symbols"
            title="Multilingual Bot Chat"
            details="Chat with a bot in the language of your choice"
            useCase={UseCase.BotChat}
            onSelected={useCaseSelected}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="todo"
            imageAlt="Recycling icon with several language symbols"
            title="Realtime Transkription"
            details="Realtime Transkription Schweizerdeutsch mit Übersetzung in mehrere Sprachen"
            useCase={UseCase.RealtimeTranscription}
            onSelected={useCaseSelected}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UseCaseCard
            image="todo"
            imageAlt="News Icon with 3 lines symbolyzing summary"
            title="Bing News Reader and Summarizer"
            details="Get the latest Bing news read out loud in your language and quickly view the summary of the events"
            useCase={UseCase.BingApi}
            onSelected={useCaseSelected}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
