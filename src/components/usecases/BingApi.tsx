import MySpeechConfig from "../../models/MySpeechConfig";

interface BingApiProps {
    speechConfig: MySpeechConfig
}
 
const BingApi: React.FC<BingApiProps> = ({speechConfig}) => {
    return (<div>
        <h1>Bing News Reader and Summarizer</h1>
    </div>);
}
 
export default BingApi;