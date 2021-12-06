import { Paper } from "@mui/material";
import React from "react";

interface PaperAreaProps {
  maxWidth: number;
}

const PaperArea: React.FC<PaperAreaProps> = ({ maxWidth, children }) => {
  return (
    <Paper
      style={{
        minHeight: "50vh",
        maxWidth: `${maxWidth}px`,
        padding: "40px",
        margin: "auto",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperArea;
