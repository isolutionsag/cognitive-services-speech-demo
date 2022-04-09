import {VolumeUp} from "@mui/icons-material";
import {Button, Grid, Typography, Divider, Alert} from "@mui/material";
import {
    Link as RouterLink,
} from 'react-router-dom';
import React from "react";
import {Voice} from "../../util/TextToSpechVoices";
import {UseCaseModel} from "../../util/UseCase";
import SpeechComponentProps from "../SpeechComponentProps";

interface UseCaseTemplateProps extends SpeechComponentProps {
    model: UseCaseModel;
    error: string;
}

export interface UseCaseTemplateChildProps extends SpeechComponentProps {
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const UseCaseTemplate: React.FC<UseCaseTemplateProps> = ({
                                                             model,
                                                             error,
                                                             children,
                                                             synthesizeSpeech,
                                                             isSynthesizing,
                                                         }) => {
    return (
        <Grid
            container
            justifyContent="start"
            alignItems="center"
            direction="row"
        >
            <Grid item xs={2} lg={1} display="flex">
                <Button component={RouterLink} to="/">Zurück</Button>
            </Grid>
            <Grid item xs={8} lg={10} textAlign="center">
                <Typography variant="h3" component="h2">{model.title}</Typography>
                <Typography variant="h6" component="h3">{model.description}</Typography>
                <Button
                    style={{ margin: "1rem 0" }}
                    onClick={() =>
                        synthesizeSpeech(model.description, Voice.de_CH_LeniNeural)
                    }
                    disabled={isSynthesizing}
                    variant="outlined"
                    size="small"
                    startIcon={<VolumeUp />}
                >
                    Anleitung vorlesen
                </Button>
            </Grid>
            <Grid item xs={2} lg={1} />
            <Grid item xs={12}>
            <Divider variant="middle" sx={{width: "100%"}}/>
            {error !== "" && (
                <>
                    <br/>
                    <Alert severity="error">{error}</Alert>
                </>
            )}
            <br/>
            {children}
            </Grid>
        </Grid>
    );
};

export default UseCaseTemplate;
