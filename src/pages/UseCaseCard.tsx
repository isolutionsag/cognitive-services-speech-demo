import React from 'react';
import {
  Typography,
  CardActionArea,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import UseCase from "../util/UseCase";

interface UseCaseCardProps {
  image: string;
  imageAlt: string;
  title: string;
  details: string;
  useCase: UseCase;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({
  image,
  imageAlt,
  title,
  details,
  useCase,
}) => {
  return (
    <Card style={{ width: "100%" }}>
      <CardActionArea>
        <CardMedia height="160" component="img" image={image} alt={imageAlt} />
        <CardContent className={`usecase usecase-${useCase}`}>
          <Typography gutterBottom variant="h5" color="white" component="div">
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="white"
          >
            {details}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default UseCaseCard;
