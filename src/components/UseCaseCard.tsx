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

const Usecase: React.FC<UsecaseProps> = ({image, imageAlt, title, details, useCase, onSelected}) => {
  return (
    <Card style={{textAlign: 'left'}}>
      <CardActionArea onClick={() => onSelected(useCase)}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={imageAlt}
        />
        <CardContent >
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" >
              {details}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Usecase;
