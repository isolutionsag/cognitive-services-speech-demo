# Getting Started with Microsoft Speech Services Demo App

This is a demo project to to demonstrate the Microsoft Speech Services in different usecases. Swiss German is the focus language of this app for both recognition and synthesis.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Technologies Used

This app uses different cognitive services by Microsoft which are documented [here](https://docs.microsoft.com/en-us/azure/cognitive-services).

The following are used by this app:
### Area of Language
1. [`QnA Maker`](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/)
2. [Translator](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/)

### Area of Speech
1. [`Speech Services`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/)
    - [`Speech-to-Text`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-to-text)
    - [`Text-to-Speech`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/text-to-speech)

### Area of Search
2. [`Bing Search API`](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/) TODO: correct `@Laurent Christen`?

All information on how to setup the services can also be found in the respective links.
## Prerequisites

### General

1. Create a Microsoft account [Create account](https://account.microsoft.com/account)

2. Create an Azure Account [Create account](https://azure.microsoft.com/en-us/free/ai/)
The Azure account comes with $200 in service credit that you can apply toward a paid Speech service subscription, valid for up to 30 days. Your Azure services are disabled when your credit runs out or expires at the end of the 30 days. 

### Setup Speech Services

[`Official documentation for Speech Service prerequisites`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free)

1. Create Azure Resource ([`Official documentation`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#create-the-azure-resource))

2. Get KEYS and LOCATION/REGION ([`Official documentation`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#find-keys-and-locationregion))

3. Enter the subscription-/resourcekey and  region
    - Option 1: Paste them in the file [MySpeechConfig](./src/models/MySpeechConfig.ts) into the `DefaultSpeechConfig` object
    - Option 2: Paste them in the Configuration Page, when running the app (Button at top right `"Configure Keys"`)

### Setup QnA Maker

//[`What is QnA Maker?`](https://docs.microsoft.com/en-us/azure/cognitive-services/QnAMaker/overview/overview)¨
[`Official of QnA Maker`](https://docs.microsoft.com/en-us/azure/cognitive-services/QnAMaker/)

### Setup Translation Service

TODO

## Links

[`Cognitive Services`](https://azure.microsoft.com/en-us/services/cognitive-services)

[`Language Identification`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-automatic-language-detection)

[`Speech translation`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speech-translation)

[Text-To-Speech](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-text-to-speech)
