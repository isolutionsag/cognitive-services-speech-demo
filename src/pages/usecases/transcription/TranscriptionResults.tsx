import { VolumeUp } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { getVoiceForLanguage } from "../../../util/Language";
import {
  SpeechServiceLanguagesNames,
  SpeechServiceLocale,
  SpeechTranslationLanguage,
  SpeechTranslationLanguagesNames,
} from "../../../util/SupportedLanguages";
import { Voice } from "../../../util/TextToSpechVoices";

interface TranscriptionResultsProps {
  synthesizeSpeech: (text: string, voice: Voice) => void;
  isSynthesizing: boolean;
  recognitionLanguage: SpeechServiceLocale;
  translationTargetLanguage: SpeechTranslationLanguage;
  recognizedResults: string[];
  translatedResults: string[];
  recognizingText: string;
  translatingText: string;
  clearResults: () => void;
  stopRecognition: () => void;
}

const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({
  synthesizeSpeech,
  isSynthesizing,
  recognitionLanguage,
  translationTargetLanguage,
  recognizedResults,
  translatedResults,
  recognizingText,
  translatingText,
  clearResults,
  stopRecognition,
}) => {
  const joinedResults: { recognizedText: string; translatedText: string }[] =
    [];
  recognizedResults.forEach((recognized, i) => {
    if (translatedResults.length > i) {
      const translated = translatedResults[i];
      joinedResults.push({
        recognizedText: recognized,
        translatedText: translated,
      });
    }
  });

  if (
    recognizingText.length + translatingText.length > 0) {
    //show currently spoken text (not yet recognized text) at bottom of
    joinedResults.push({
      recognizedText: recognizingText,
      translatedText: translatingText,
    });
  }

  const clearRecordingsButton = () => (
    <Tooltip title="Alle Aufnahmen löschen">
      <Button onClick={clearResults} variant="outlined" color="error">
        Aufräumen
      </Button>
    </Tooltip>
  );

  const speakerButtonText = (languageName: string) =>
    `Auf ${languageName} wiedergeben`;

  const speakerButtons = () => (
    <Grid container sx={{ marginTop: "1rem" }} justifyContent="space-between">
      <Grid item>
        <Button
          onClick={() => {
            stopRecognition();
            const voice = getVoiceForLanguage(recognitionLanguage);
            const text = recognizedResults.reduce((a, b) => a + " " + b, "");
            synthesizeSpeech(text, voice);
          }}
          disabled={recognizedResults.length < 1 || isSynthesizing}
          color={isSynthesizing ? "secondary" : "primary"}
          variant="outlined"
          startIcon={<VolumeUp />}
        >
          {speakerButtonText(SpeechServiceLanguagesNames[recognitionLanguage])}
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            stopRecognition();
            const voice = getVoiceForLanguage(translationTargetLanguage);
            const text = translatedResults.reduce((a, b) => a + " " + b, "");
            synthesizeSpeech(text, voice);
          }}
          disabled={translatedResults.length < 1 || isSynthesizing}
          color={isSynthesizing ? "secondary" : "primary"}
          variant="outlined"
          startIcon={<VolumeUp />}
        >
          {speakerButtonText(
            SpeechTranslationLanguagesNames[translationTargetLanguage]
          )}
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Box
      border="1px solid black"
      borderRadius="5px"
      padding="10px"
      minWidth="800px"
    >
      <Grid container>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Typography variant="h4">Aufnahmen</Typography>
          {joinedResults.length > 0 && clearRecordingsButton()}
        </Grid>
        {joinedResults.length > 0 ? (
          <>
            <TranscriptionResultsTable results={joinedResults} />
            {speakerButtons()}
          </>
        ) : (
          <Typography variant="h6">
            Klicke den <em>Aufnahme Starten</em> Knopf und rede los...
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

const TranscriptionResultsTable: React.FC<{
  results: { recognizedText: string; translatedText: string }[];
}> = ({ results }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">
                <b>Erkannte Sätze</b>
              </Typography>
            </TableCell>
            <TableCell className="translated-text-cell">
              <Typography variant="h6">
                <b>Übersetzung</b>
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => {
            const isLastItem = index === results.length - 1;
            return (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant={isLastItem ? "h6" : "subtitle1"}>
                    {result.recognizedText}
                  </Typography>{" "}
                </TableCell>
                <TableCell className="translated-text-cell">
                  <Typography variant={isLastItem ? "h6" : "subtitle1"}>
                    {result.translatedText}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TranscriptionResults;
