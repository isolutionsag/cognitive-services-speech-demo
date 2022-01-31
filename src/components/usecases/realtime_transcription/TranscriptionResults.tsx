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
import React, { useEffect, useState } from "react";
import { SpeechToTextContinuous } from "../../../hooks/useSpeechToTextContinuous";
import { getVoiceForLanguage } from "../../../util/Language";
import {
  SpeechServiceLanguagesNames,
  SpeechTranslationLanguagesNames,
} from "../../../util/SupportedLanguages";
import { Voice } from "../../../util/TextToSpechVoices";

interface TranscriptionResultsProps {
  synthesizeSpeech: (text: string, voice: Voice) => void;
  isSynthesizing: boolean;
  speechToTextContinuous: SpeechToTextContinuous;
  handleHasResults(hasResults: boolean): void;
}

const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({
  synthesizeSpeech,
  isSynthesizing,
  speechToTextContinuous,
  handleHasResults,
}) => {
  const [recognizedResults, setRecognizedResults] = useState<string[]>([]);
  const [translatedResults, setTranslatedResults] = useState<string[]>([]);

  useEffect(() => {
    handleHasResults(recognizedResults.length > 0);
  }, [recognizedResults]);

  useEffect(() => {
    const recognizedText = speechToTextContinuous.recognizedText;
    if (recognizedText && recognizedText.length > 0) {
      setRecognizedResults([...recognizedResults, recognizedText]);
    }
  }, [speechToTextContinuous.recognizedText]);

  useEffect(() => {
    const translatedText = speechToTextContinuous.translatedText;
    if (translatedText && translatedText.length > 0) {
      setTranslatedResults([...translatedResults, translatedText]);
    }
  }, [speechToTextContinuous.translatedText]);

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
    speechToTextContinuous.recognizingText.length > 0 &&
    speechToTextContinuous.translatingText.length > 0 &&
    speechToTextContinuous.recognizingText !==
      joinedResults[joinedResults.length - 1]?.recognizedText
  ) {
    //show currently spoke (not yet recognized text) at bottom of
    joinedResults.push({
      recognizedText: speechToTextContinuous.recognizingText,
      translatedText: speechToTextContinuous.translatingText,
    });
  }

  const clearRecordingsButton = () => (
    <Tooltip title="Alle Aufnahmen löschen">
      <Button
        onClick={() => {
          setRecognizedResults([]);
          setTranslatedResults([]);
        }}
        variant="outlined"
        color="error"
      >
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
            speechToTextContinuous.sttFromMicStop();
            const voice = getVoiceForLanguage(
              speechToTextContinuous.recognitionLanguage
            );
            const text = recognizedResults.reduce((a, b) => a + " " + b, "");
            synthesizeSpeech(text, voice);
          }}
          disabled={recognizedResults.length < 1 || isSynthesizing}
          color={isSynthesizing ? "secondary" : "primary"}
          variant="outlined"
          startIcon={<VolumeUp />}
        >
          {speakerButtonText(
            SpeechServiceLanguagesNames[
              speechToTextContinuous.recognitionLanguage
            ]
          )}
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            speechToTextContinuous.sttFromMicStop();
            const voice = getVoiceForLanguage(
              speechToTextContinuous.translationTargetLanguage
            );
            const text = translatedResults.reduce((a, b) => a + " " + b, "");
            synthesizeSpeech(text, voice);
          }}
          disabled={translatedResults.length < 1 || isSynthesizing}
          color={isSynthesizing ? "secondary" : "primary"}
          variant="outlined"
          startIcon={<VolumeUp />}
        >
          {speakerButtonText(
            SpeechTranslationLanguagesNames[
              speechToTextContinuous.translationTargetLanguage
            ]
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
          <Typography variant="h6" color="primary">
            Klicke den <em>Aufnahme Starten Knopf</em> and rede los...
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
              <TableRow>
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
