/**
 * Copyright 2020 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http://aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
**/

const Alexa     = require('ask-sdk-core');
const util      = require('./util');
const process = require('process');

// add firebase
const firebase = require("firebase");

firebase.initializeApp({
    apiKey: 'AIzaSyAY0F2osDlc9j6P6FQeHRn3y5mOROtbhpg',
    authDomain: 'cocobot-gix.firebaseapp.com',
    databaseURL: 'https://cocobot-gix.firebaseio.com',
    projectId: 'cocobot-gix',
    storageBucket: 'cocobot-gix.appspot.com',
    messagingSenderId: '901645805895',
    appId: '1:901645805895:android:6174bbf516f640c0960462',
});

/**
 * API Handler for RecordColor API
 * 
 * @param handlerInput
 * @returns API response object 
 * 
 * See https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html
 */
 
  // StartSession
const StartSessionApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'StartSession');
    },
    handle(handlerInput) {
        console.log("Api Request [StartSession]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        // First get our request entity and grab the color passed in the API call
        const args = util.getApiArguments(handlerInput);
        const InitExercise = args.InitExercise;
        // Store the favorite color in the session
        // const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        // sessionAttributes.favoriteColor = color;
        
        let response = {
            apiResponse: 0
        };

        console.log("Api Response [StartSession]: ", JSON.stringify(response, null, 2));
        return response;
    }
}


// PlaySessionAudio
const PlaySessionAudioeApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'PlaySessionAudio');
    },
    async handle(handlerInput) {
        console.log("Api Request [PlaySessionAudio]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        var db = firebase.database();
        var ref = db.ref('LastRecommendedResource');
        
        let response = {
            apiResponse: ''
        };
        
        const data_snapshot = await ref.once('value');
        db.goOffline();
        const result = data_snapshot.val();
        console.log("result", result);
        try{
            const Uri = result.audiouri;
            console.log('get firebase data URI', Uri)
            response = {
                apiResponse: Uri
            };
        }catch(e){
            console.log("get firebase data URI ERROR", e)
        }

        console.log("Api Response [PlaySessionAudio]: ", JSON.stringify(response, null, 2));
        return response;
    }
}


 // RecordRating
const RecordRatingApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'RecordRating');
    },
    handle(handlerInput) {
        console.log("Api Request [RecordRating]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        // First get our request entity and grab the color passed in the API call
        const args = util.getApiArguments(handlerInput);
        const userrating = args.userrating;
        
        let response = {
            apiResponse: ''
        };
        
        if (userrating === 4 || userrating === 5 ){
            console.log("High Rating")
            response = {
                apiResponse: 'Great'
            };
        } else if (userrating === 1 || userrating === 2 || userrating === 3 ) {
            console.log("Low Rating")
            response = {
                apiResponse: 'Sorry, You do not like it'
            };
        } else {
            console.log("Out of Rating Range")
            response = {
                apiResponse: 'Sorry, please using number between one to five!'
            };
        }
        
        console.log("Api Response [RecordRating]: ", JSON.stringify(response, null, 2));
        return response;
    }
}


/**
 * API Handler for RecordColor API
 * 
 * @param handlerInput
 * @returns API response object 
 * 
 * See https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html
 */
const RecordColorApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'RecordColor');
    },
    handle(handlerInput) {
        console.log("Api Request [RecordColor]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        // First get our request entity and grab the color passed in the API call
        const args = util.getApiArguments(handlerInput);
        const color = args.color;
        // Store the favorite color in the session
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.favoriteColor = color;

        let response = {
            apiResponse: {
                color : color
            }
        };
        console.log("Api Response [RecordColor]: ", JSON.stringify(response, null, 2));
        return response;
    }
}
const IntroToAlexaConversationsButtonEventHandler = {
    canHandle(handlerInput){
        console.log(JSON.stringify(handlerInput.requestEnvelope));
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.arguments[0] === 'SetFavoriteColor';
    },
    handle(handlerInput){
       return handlerInput.responseBuilder
                    .addDirective({
                        type: 'Dialog.DelegateRequest',
                        target: 'AMAZON.Conversations',
                        period: {
                            until: 'EXPLICIT_RETURN' 
                        },
                        updatedRequest: {
                            type: 'Dialog.InputRequest',
                            input: {
                                name: 'SpecifyFavoriteColor',
                                slots: {
                                    name: {
                                        name : 'color',
                                        value: handlerInput.requestEnvelope.request.arguments[1]
                                    }
                                }
                            }
                        }
                    })
                    .getResponse();
    }
}

/**
 * API Handler for GetFavoriteColor API
 * 
 * @param handlerInput
 * @returns API response object 
 * 
 * See https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html
 */
const GetFavoriteColorApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'GetFavoriteColor');
    },
    handle(handlerInput) {
        console.log("Api Request [GetFavoriteColor]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        
        // Get the favorite color from the session
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (sessionAttributes.favoriteColor){
            var color = sessionAttributes.favoriteColor;
        }
        let response = {
            apiResponse: {
                color : color
            }
        };
        
        console.log("Api Response [GetFavoriteColor]: ", JSON.stringify(response, null, 2));
        return response;
    }
}
/**
 * FallbackIntentHandler - Handle all other requests to the skill 
 * 
 * @param handlerInput
 * @returns response
 * 
 * See https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html
 */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        // return request.type === 'IntentRequest' && request.intent.name !== 'GetFavoriteColorApiHandler' && request.intent.name !== 'RecordColorApiHandler';
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked' && request.apiRequest.name !== 'StartSessionApiHandler' && request.apiRequest.name !== 'PlaySessionAudioeApiHandler'  && request.apiRequest.name !== 'RecordRatingApiHandler';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        console.log('In catch all intent handler. Intent invoked: ' + intentName);
        const speechOutput = "Hmm, I'm not sure. You can tell me more or What would you like to do!";

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};
// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
// *****************************************************************************
// These simple interceptors just log the incoming and outgoing request bodies to assist in debugging.

const LogRequestInterceptor = {
    process(handlerInput) {
        console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
    },
};

const LogResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`RESPONSE = ${JSON.stringify(response)}`);
    },
};
// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LogRequestInterceptor)
    .addResponseInterceptors(LogResponseInterceptor)
    .addRequestHandlers(
        // RecordColorApiHandler,
        // GetFavoriteColorApiHandler,
        // IntroToAlexaConversationsButtonEventHandler,
        StartSessionApiHandler,
        PlaySessionAudioeApiHandler,
        RecordRatingApiHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler
    )
     .withCustomUserAgent('reference-skills/intro-to-alexa-conversations/v1')
    .lambda();