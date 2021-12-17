import {
  Typography,
  CardActionArea,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import UseCase from "../util/UseCase";

interface UsecaseProps {
  image: string;
  imageAlt: string;
  title: string;
  details: string;
  useCase: UseCase;
  onSelected: (useCase: UseCase) => void;
}

const Usecase: React.FC<UsecaseProps> = ({
  image,
  imageAlt,
  title,
  details,
  useCase,
  onSelected,
}) => {
  return (
    <Card style={{ textAlign: "left" }}>
      <CardActionArea onClick={() => onSelected(useCase)}>
        <CardMedia height="160" component="img" image={image} alt={imageAlt} />
        <CardContent className={`usecase usecase-${useCase}`}>
          <Typography gutterBottom variant="h5" color="white" component="div">
            {title}
          </Typography>
          <Typography
            variant="body1"
            color={
              useCase === UseCase.NewsReader ||
              useCase === UseCase.RealtimeTranscription
                ? "white"
                : "lightgrey"
            }
          >
            {details}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Usecase;
