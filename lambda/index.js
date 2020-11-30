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
const process   = require('process');

// add firebase
const firebase  = require("firebase");

firebase.initializeApp({
    apiKey: 'AIzaSyAY0F2osDlc9j6P6FQeHRn3y5mOROtbhpg',
    authDomain: 'cocobot-gix.firebaseapp.com',
    databaseURL: 'https://cocobot-gix.firebaseio.com',
    projectId: 'cocobot-gix',
    storageBucket: 'cocobot-gix.appspot.com',
    messagingSenderId: '901645805895',
    appId: '1:901645805895:android:6174bbf516f640c0960462',
});

const db = firebase.database();

//local data
const localdata = require('./resourcesdata.json');

/**
 * API Handler for RecordColor API
 * 
 * @param handlerInput
 * @returns API response object 
 * 
 * See https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html
 */

const GetInitialInformationApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'GetInitialInformation');
    },
    handle(handlerInput) {
        console.log("Api Request [GetInitialInformation]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        // First get our request entity and grab the availabletime passed in the API call
        const args = util.getApiArguments(handlerInput);
        const availabletime = args.availabletime;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.availabletime = availabletime;
        
        let response = {
            apiResponse: 0
        };

        console.log("Api Response [GetInitialInformation]: ", JSON.stringify(response, null, 2));
        return response;
    }
}
 
// StartSession
const StartSessionApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'StartSession');
    },
    handle(handlerInput) {
        console.log("Api Request [StartSession]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        // First get our request entity and grab the InitExercise passed in the API call
        const args = util.getApiArguments(handlerInput);
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const InitExercise = args.InitExercise;
        sessionAttributes.InitExercise = InitExercise;

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
    handle(handlerInput) {
        console.log("Api Request [PlaySessionAudio]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        let response = {
            apiResponse: ''
        };

        // try read LastRecommendedResource
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (!sessionAttributes.audiouri) {
            // sessionAttributes.audiouri = "https://cocobotpracticeaudio.s3-us-west-2.amazonaws.com/final_resources/2min_breathing_exercise_no_piano.mp3"
            const index = Math.floor(Math.random() * (localdata.length-2))
            // console.log("localdata", localdata[index]);
            sessionAttributes.audiouri = localdata[index]
        } else {
            if (sessionAttributes.tryothers) {
                if (sessionAttributes.tryothers === 'on') {
                    if (sessionAttributes.InitExercise === 'breathing' || sessionAttributes.InitExercise === 'breathing exercise') {
                        sessionAttributes.audiouri = "https://cocobotpracticeaudio.s3-us-west-2.amazonaws.com/final_resources/2min_breathing_exercise_no_piano.mp3"
                    } else if (sessionAttributes.InitExercise === 'music' || sessionAttributes.InitExercise === 'calming music') {
                        sessionAttributes.audiouri = "https://cocobotpracticeaudio.s3-us-west-2.amazonaws.com/final_resources/4min_calming_music.mp3"
                    } else {
                        let short_localdata = localdata.slice(0, 3)
                        let temp =  short_localdata.filter(data => data !== sessionAttributes.audiouri)
                        console.log("temp", temp)
                        sessionAttributes.audiouri = temp[Math.floor(Math.random() * (temp.length))]
                    }

                }
            }
            if (sessionAttributes.userrating) {
                if (sessionAttributes.userrating === 1  || sessionAttributes.userrating === 2 || sessionAttributes.userrating === 3) {
                    let temp =  localdata.filter(data => data !== sessionAttributes.audiouri)
                    sessionAttributes.audiouri = temp[Math.floor(Math.random() * temp.length)]
                }
            } 
        }
        sessionAttributes.tryothers = 'off';
        // console.log("sessionAttributes.audiouri", sessionAttributes.audiouri)
        const Uri = sessionAttributes.audiouri;
        response = {
            apiResponse: Uri
        };
        
        
        // if (!sessionAttributes.uri) {
        //     console.log("not get sessionAttributes uri")
        //     // testing
        //     const ref_audio = db.ref('LastRecommendedResource');
        //     // let ref_rating = db.ref('LastRatingScore');
        //     const data_snapshot_audio = await ref_audio.once('value');
        //     // const data_snapshot_rating = await ref_rating.once('value');
        //     const result_audio = data_snapshot_audio.val();
        //     // const result_rating = data_snapshot_rating.val();
        //     sessionAttributes.uri = result_audio;
        //     db.goOffline();
        //     console.log("audio: ", result_audio);
        //     // console.log("rating ", result_rating);
        // } else {
        //     // testing
        //     console.log("get sessionAttributes uri")
        //     db.goOnline();
        //     const ref_audio = db.ref('LastRecommendedResource');
        //     const data_snapshot_audio = await ref_audio.once('value');
        //     const result_audio = data_snapshot_audio.val();
        //     sessionAttributes.uri = result_audio;
        //     db.goOffline();
        //     console.log("audio: ", result_audio);
        //     // console.log("rating ", result_rating);
        // }


        // try{
        //     if (!sessionAttributes.userrating) {
        //         Uri = sessionAttributes.uri.audiouri
        //         console.log('get firebase data URI', Uri)
        //     } else {
        //         if (sessionAttributes.userrating === 1  || sessionAttributes.userrating === 2 || sessionAttributes.userrating === 3){
        //             Uri = 'https://cocobotpracticeaudio.s3-us-west-2.amazonaws.com/final_resources/6min_meditation.mp3'
        //             console.log('get firebase data URI', Uri)
        //         } else {
        //             Uri = sessionAttributes.uri.audiouri
        //             console.log('get firebase data URI', Uri)
        //         }
        //     }
            
        //     response = {
        //         apiResponse: Uri
        //     };

        // }catch(e){
        //     console.log("get firebase data URI ERROR", e)
        // }

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
        // First get our request entity and grab the rating passed in the API call
        const args = util.getApiArguments(handlerInput);
        const userrating = args.userrating;
        console.log('args.userrating', args.userrating);
        
        // Store the Rating in the session
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.userrating = userrating;

        let response = {
            apiResponse: ''
        };
        
        // Provide different responses based on rating score
        console.log("userrating", userrating);
        if (userrating === 4 || userrating === 5){
            console.log("High Rating");
            let resp_for_high_rating = [
                'I am glad you like the exercise! Do you want to practice it again, try another exercise, or end the session?',
                'That’s awesome! I’m glad you like it! Do you want to practice it again, try another exercise, or end the session?'
            ];
            // random choice
            response = {
                apiResponse: resp_for_high_rating[Math.floor(Math.random() * resp_for_high_rating.length)]
            };
        } else if (userrating === 1 || userrating === 2 || userrating === 3) {
            console.log("Low Rating");
            let resp_for_low_rating = [
                'I am sorry you do not like the exercise that much. Would you like to try other exercises, or end the session?',
                'Hmm, I will try to recommend something else next time. Do you want to try other exercises, or end the session?'
            ];
            
            response = {
                apiResponse: resp_for_low_rating[Math.floor(Math.random() * resp_for_low_rating.length)]
            };
        } else {
            console.log("Out of Rating Range");
            response = {
                apiResponse: 'Sorry, please using a number between one to five!'
            };
        }

        console.log("Api Response [RecordRating]: ", JSON.stringify(response, null, 2));
        return response;
    }
}


// RunTryOthers
const TryOthersApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'TryOthers');
    },
    handle(handlerInput) {
        console.log("Api Request [TryOthers]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        
        // Store TryOthers status in the session
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.tryothers = 'on';
        
        let response = {
            apiResponse: 0
        };
        console.log("Api Response [TryOthers]: ", JSON.stringify(response, null, 2));
        return response;
    }
}

// ProvideFeedback
const ProvideFeedbackApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'ProvideFeedback');
    },
    handle(handlerInput) {
        console.log("Api Request [ProvideFeedback]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        let feedback = 'no input'
        // Store the Rating in the session
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       
        
        try {
            if (handlerInput.requestEnvelope.request.apiRequest.input) {
               console.log("Api Request [ProvideFeedback] Inpurt: ", handlerInput.requestEnvelope.request.apiRequest.input);
               feedback = handlerInput.requestEnvelope.request.apiRequest.input
               sessionAttributes.feedback = feedback;
            }
        } catch(e) {
            console.log("Api Request [ProvideFeedback] Inpurt: ", e);
        }

        let response = {
            apiResponse: 0
        };

        console.log("Api Response [ProvideFeedback]: ", JSON.stringify(response, null, 2));
        return response;
    }
    // async handle(handlerInput) {
    //     console.log("Api Request [ProvideFeedback]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
    //     let feedback = 'no input'
    //     try {
    //         if (handlerInput.requestEnvelope.request.apiRequest.input) {
    //           console.log("Api Request [ProvideFeedback] Inpurt: ", handlerInput.requestEnvelope.request.apiRequest.input);
    //           feedback = handlerInput.requestEnvelope.request.apiRequest.input
    //         }
    //     } catch(e) {
    //         console.log("Api Request [ProvideFeedback] Inpurt: ", e);
    //     }
        
    //     let db = firebase.database();
    //     let ref = db.ref('Alexa/Feedback');
        
    //     // console.log("db", db);
    //     const result = await ref.set(JSON.stringify(feedback));
    //     db.goOffline();
        
    //     let response = {
    //         apiResponse: 0
    //     };

    //     console.log("Api Response [ProvideFeedback]: ", JSON.stringify(response, null, 2));
    //     return response;
    // }
}



// IntroduceCOCO
const IntroduceCOCOApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'IntroduceCOCO');
    },
    handle(handlerInput) {
        console.log("Api Request [IntroduceCOCO]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        let response = {
            apiResponse: 0
        };
        console.log("Api Response [IntroduceCOCO]: ", JSON.stringify(response, null, 2));
        return response;
    }
}

// NotFriendlyAPI
const NotFriendlyAPIApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'NotFriendlyAPI');
    },
    handle(handlerInput) {
        console.log("Api Request [NotFriendlyAPI]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        let response = {
            apiResponse: 0
        };
        console.log("Api Response [NotFriendlyAPI]: ", JSON.stringify(response, null, 2));
        return response;
    }
}

// NoHumanAPI
const NoHumanAPIAPIApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'NoHumanAPI');
    },
    handle(handlerInput) {
        console.log("Api Request [NoHumanAPI]: ", JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
        let response = {
            apiResponse: 0
        };
        console.log("Api Response [NoHumanAPI]: ", JSON.stringify(response, null, 2));
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
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked'
                && request.apiRequest.name !== 'StartSessionApiHandler' && request.apiRequest.name !== 'PlaySessionAudioeApiHandler'
                && request.apiRequest.name !== 'RecordRatingApiHandler' && request.apiRequest.name !== 'ProvideFeedbackApiHandler'
                && request.apiRequest.name !== 'TryOthersApiHandler' && request.apiRequest.name !== 'GetInitialInformationApiHandler'
                && request.apiRequest.name !== 'IntroduceCOCOApiHandler' && request.apiRequest.name !== 'NotFriendlyAPIApiHandler'
                && request.apiRequest.name !== 'NoHumanAPIAPIApiHandler';
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
        GetInitialInformationApiHandler,
        StartSessionApiHandler,
        PlaySessionAudioeApiHandler,
        RecordRatingApiHandler,
        ProvideFeedbackApiHandler,
        TryOthersApiHandler,
        IntroduceCOCOApiHandler,
        NotFriendlyAPIApiHandler,
        NoHumanAPIAPIApiHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler
    )
    .withCustomUserAgent('reference-skills/intro-to-alexa-conversations/v1')
    .lambda();