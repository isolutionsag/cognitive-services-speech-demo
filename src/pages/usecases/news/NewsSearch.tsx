import React from "react";
import {Button, IconButton, TextField} from "@mui/material";
import {Search} from "@mui/icons-material";

interface NewsSearch {
    search: (query: string) => void;
}

const NewsSearch: React.FC<NewsSearch> = ({search}) => {
    const [query, setQuery] = React.useState<string>("Schweiz");

    const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            search(query);
        }}>
            <TextField label="Nachrichten Thema" variant="outlined" value={query} onChange={onChangeQuery}
                       InputProps={{
                           endAdornment: (
                               <IconButton type="submit"><Search/></IconButton>
                           )
                       }}/>
        </form>);
};

export default NewsSearch;