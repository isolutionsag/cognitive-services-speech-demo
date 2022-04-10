import React from 'react';
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import {Button, Paper, Typography} from "@mui/material";
import {VpnKey} from "@mui/icons-material";
import {Link as RouterLink, Outlet} from "react-router-dom";
import IsolutionsLogo from "./assets/isolutions.svg";
import AzureLogo from "./assets/azure.svg";

const Layout: React.FC = () => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{flexGrow: 1, display: {xs: "flex", md: "flex"}}}>
                        <img
                            src={IsolutionsLogo}
                            style={{margin: "1rem", height: "32px"}}
                            alt="isolutions"
                        />
                    </Box>
                    <Box>
                        <Button
                            variant="contained"
                            startIcon={<VpnKey/>}
                            component={RouterLink}
                            to="settings"
                        >
                            Schlüssel konfigurieren
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
                <Paper
                    sx={{
                        minHeight: "60vh",
                        padding: "2rem",
                        margin: "1rem",
                    }}
                    component="main"
                >
                    <Outlet/>
                </Paper>
            <Box component="footer" paddingRight="1rem" paddingLeft="1rem" display="flex" justifyContent="space-between"
                 alignItems="center">
                <Typography variant="body2" display="flex" alignItems="center">powered by <a
                    href="https://azure.microsoft.com/en-us/services/cognitive-services/" rel="noreferrer"
                    target="_blank">
                    <img src={AzureLogo} alt="Azure Logo"
                         style={{height: "24px", paddingLeft: ".3rem", paddingRight: ".3rem"}}/>
                </a>
                </Typography>
                <Typography variant="body2">created by <a href="https://www.isolutions.ch" target="_blank"
                                                          rel="noreferrer">isolutions AG</a></Typography>
            </Box>
        </>
    );
};

export default Layout;