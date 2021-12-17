# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Prerequisites

### General

1. Create a Microsoft account [Create account](https://account.microsoft.com/account)

2. Create an Azure Account [Create account](https://azure.microsoft.com/en-us/free/ai/)
The Azure account comes with $200 in service credit that you can apply toward a paid Speech service subscription, valid for up to 30 days. Your Azure services are disabled when your credit runs out or expires at the end of the 30 days. 

### Setup Speech Services

[`Official documentation for Speech Service prerequisites`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#try-the-speech-service-for-free)

1. [`Official documentation to create Azure Resource`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#create-the-azure-resource)

2. [`Official documentation to get KEYS and LOCATION/REGION`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview#find-keys-and-locationregion)

3. Enter the subscription-/resourcekey and  region
    - Option 1: Paste them in the file [MySpeechConfig](./src/models/MySpeechConfig.ts) into the `DefaultSpeechConfig` object
    - Option 2: Paste them in the Configuration Page, when running the app (Button at top right)

### Setup QnA Maker

TODO

### Setup Translation Service

TODO

## Links

[`Cognitive Services`](https://azure.microsoft.com/en-us/services/cognitive-services)

[`Language Identification`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-automatic-language-detection)

[`Speech translation`](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speech-translation)

[Text-To-Speech](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-text-to-speech)
