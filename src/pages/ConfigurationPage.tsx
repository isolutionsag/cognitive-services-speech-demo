import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import React from "react";
import SpeechServiceConfiguration from "../models/SpeechServiceConfiguration";
import useInput from "../hooks/useInput";
import {Save} from "@mui/icons-material";
import QnAConfig from "../models/QnAConfig";
import TranslatorConfig from "../models/TranslatorConfig";
import BingSearchConfig from "../models/BingSearchConfig";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {ICognitiveServicesConfiguration} from "../App";

interface ConfigFormProps {
    speechServiceConfig: SpeechServiceConfiguration;
    qnaConfig: QnAConfig;
    translatorConfig: TranslatorConfig;
    bingSearchConfig: BingSearchConfig;
    onConfigurationChanged: (newConfiguration: ICognitiveServicesConfiguration) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
                                                   speechServiceConfig,
                                                   qnaConfig,
                                                   translatorConfig,
                                                   bingSearchConfig,
                                                   onConfigurationChanged,
                                               }) => {
    const navigate = useNavigate();
    const useInputResourceKey = useInput(speechServiceConfig.resourceKey);
    const useInputRegion = useInput(speechServiceConfig.region);

    const useInputKbId = useInput(qnaConfig.knowledgeBaseId);
    const useInputAuthEndpointKey = useInput(qnaConfig.authEndpointKey);
    const useInputBotName = useInput(qnaConfig.qnaMakerServiceName);

    const useInputTranslatorSubscriptionKey = useInput(
        translatorConfig.subscriptionKey
    );
    const useInputTranslatorRegion = useInput(translatorConfig.region);

    const useInputBingSearchSubscriptionKey = useInput(
        bingSearchConfig.subscriptionKey
    );

    const saveKeys = () => {
        const speechServiceConfiguration: SpeechServiceConfiguration = {
            resourceKey: useInputResourceKey.value,
            region: useInputRegion.value
        };
        const qnaServiceConfiguration: QnAConfig = {
            knowledgeBaseId: useInputKbId.value,
            authEndpointKey: useInputAuthEndpointKey.value,
            qnaMakerServiceName: useInputBotName.value
        };
        const translatorServiceConfiguration: TranslatorConfig = {
            subscriptionKey: useInputTranslatorSubscriptionKey.value,
            region: useInputTranslatorRegion.value
        };
        const bingSearchServiceConfiguration: BingSearchConfig = {subscriptionKey: useInputBingSearchSubscriptionKey.value};
        onConfigurationChanged({
            speechServiceConfiguration,
            qnaServiceConfiguration,
            translatorServiceConfiguration,
            bingSearchServiceConfiguration
        })
        navigate("/");
    };

    return (
        <Grid
            container
            justifyContent="start"
            alignItems="start"
            direction="row">
            <Grid item xs={3} lg={2} display="flex" sx={{padding: '1rem'}}>
                <Button component={RouterLink} to="/">Zurück</Button>
            </Grid>
            <Grid item xs={6} lg={8}>
                <form onSubmit={saveKeys}>
                    <Box textAlign="center">
                        <Typography variant="h3" component="h2">Schlüssel konfigurieren</Typography>
                    </Box>
                    <Stack sx={{marginTop: "1rem"}} spacing={2}>
                        <Stack spacing={2}>
                            <Typography variant="h6">Speech service</Typography>
                            <TextField
                                fullWidth
                                label="Abonnementschlüssel"
                                value={useInputResourceKey.value}
                                onChange={useInputResourceKey.handleChange}
                            />
                            <TextField
                                fullWidth
                                label="Region"
                                value={useInputRegion.value}
                                onChange={useInputRegion.handleChange}
                            />
                        </Stack>
                        <Stack spacing={2}>
                            <Typography variant="h6">QnAMaker</Typography>
                            <TextField
                                fullWidth
                                label="KB (Knowledge Base) Id"
                                value={useInputKbId.value}
                                onChange={useInputKbId.handleChange}
                            />
                            <TextField
                                fullWidth
                                label="AuthEndpoint Schlüssel"
                                value={useInputAuthEndpointKey.value}
                                onChange={useInputAuthEndpointKey.handleChange}
                            />
                            <TextField
                                fullWidth
                                label="Bot Name"
                                value={useInputBotName.value}
                                onChange={useInputBotName.handleChange}
                            />
                        </Stack>
                        <Stack spacing={2}>
                            <Typography variant="h6">Translator</Typography>
                            <TextField
                                fullWidth
                                label="Abonnementschlüssel"
                                value={useInputTranslatorSubscriptionKey.value}
                                onChange={useInputTranslatorSubscriptionKey.handleChange}
                            />
                            <TextField
                                fullWidth
                                label="Region"
                                value={useInputTranslatorRegion.value}
                                onChange={useInputTranslatorRegion.handleChange}
                            />
                        </Stack>
                        <Stack spacing={2}>
                            <Typography variant="h6">Bing Search</Typography>
                            <TextField
                                fullWidth
                                label="Abonnementschlüssel"
                                value={useInputBingSearchSubscriptionKey.value}
                                onChange={useInputBingSearchSubscriptionKey.handleChange}
                            />
                        </Stack>
                    </Stack>
                    <div>
                        <Button
                            style={{marginTop: "20px"}}
                            variant="contained"
                            startIcon={<Save/>}
                            type="submit"
                        >
                            Speichern und schliessen
                        </Button>
                    </div>
                </form>
            </Grid>
            <Grid item xs={3} lg={2}/>
        </Grid>
    );
};

export default ConfigForm;
