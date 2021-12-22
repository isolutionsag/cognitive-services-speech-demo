# Getting Started with Microsoft Speech Services Demo App

This is a demo project to to demonstrate the Microsoft Speech Services in different usecases. Swiss German is the focus language of this app for both recognition and synthesis.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all dependency packages.\
Wait for the installation to complete, then you are able to run the app with `npm start`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Technologies Used

This app uses different cognitive services by Microsoft which are documented [here](https://docs.microsoft.com/en-us/azure/cognitive-services).

The following are used by this app:
### Area of Language
1. [QnA Maker](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/)
2. [Translator](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/)

### Area of Speech
1. [Speech Services](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/)
    - [Speech-to-Text](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-to-text)
    - [Text-to-Speech](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/text-to-speech)

### Area of Search
2. [Bing News Search API](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-news-search/search-the-web)

All information on how to setup the services can also be found in the respective links.

## Prerequisites

To run this app with your own service resources follow the following prerequisite steps:

### General

1. Create a Microsoft account [Create account](https://account.microsoft.com/account)

2. Create an Azure Account [Create account](https://azure.microsoft.com/en-us/free/ai/)
The Azure account comes with $200 in service credit that you can apply toward a paid Speech service subscription, valid for up to 30 days. Your Azure services are disabled when your credit runs out or expires at the end of the 30 days. 

### Setup Speech Services

[Official documentation for Speech Service prerequisites](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free)

1. Create Azure Resource ([Official documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#create-the-azure-resource))

2. Get KEYS and LOCATION/REGION ([Official documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#find-keys-and-locationregion))

3. Enter the subscription-/resourcekey and  region
    - Option 1: Paste them in the file [MySpeechConfig](./src/models/MySpeechConfig.ts) into the `DefaultSpeechConfig` object
    - Option 2: Paste them in the Configuration Page, when running the app (Button at top right `"Schlüssel konfigurieren"`)

### Setup QnA Maker

[Official documentation to setup QnAMaker with Sdk](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/quickstarts/quickstart-sdk?pivots=programming-language-javascript#prerequisites)

1. Create a [QnA Maker Resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) in the Azure Portal and wait until it is deployed
2. Create a new `Knowledge Base (KB)` [here](https://www.qnamaker.ai/Create), [Official quick start quide to create KB](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/quickstarts/create-publish-knowledge-base)
    - Select the same Subscription for the QnA KB as the one from the just created azure QnA resource and select the QnA Resource you just created
    - Select your KB language which you cannot change later
4. (Optional) Import our KB [Questions and Answers Sheet](./path/to/sheet.excel) into your KB.
5. Select `Publish` to create an endpoint for the KB
            5. Get your KB Details by clicking the `View Code` button in the [KBs overview](https://www.qnamaker.ai/Home/MyServices) and copying the the `KB ID`and `authEndpointKey`. You also need the `QnA Service Name` for the QnA configuration.
6. Enter the KB ID, authEndpointKey and QnA Service Name:
    - Option 1: Paste them in the file [QnAConfig](./src/models/QnAConfig.ts) into the `DefaultQnAConfig` object
    - Option 2: Paste them in the Configuration Page, when running the app (Button at top right `"Schlüssel konfigurieren"`)

### Setup Translation Service

1. Create a Translator Resource: [Official documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-how-to-signup)

2. Copy the subscription key and
    - Option 1: Paste them in the file [TranslatorConfig](./src/models/TranslatorConfig.ts) into the `DefaultTranslatorConfig` object
    - Option 2: Paste them in the Configuration Page, when running the app (Button at top right `"Schlüssel konfigurieren"`)

### Setup Bing Web Search

1. Create a [Bing Search Resource](https://portal.azure.com/#create/Microsoft.BingSearch), [Offcial documentation](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/create-bing-search-service-resource)
2. Copy the subscription Key and
    - Option 1: Paste them in the file [BingSearchConfig](./src/models/BingSearchConfig.ts) into the `DefaultBingSearchConfig` object
    - Option 2: Paste them in the Configuration Page, when running the app (Button at top right `"Schlüssel konfigurieren"`)

[Web Search API v7 reference](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/reference/endpoints)

## Now you are ready to Rock'n'Roll!

## Further Links

[Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services)

[Language Identification](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-automatic-language-detection)

[Speech translation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speech-translation)

[Text-To-Speech](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-text-to-speech)
