# Cocobot_GIX_Alexa_Conversation Version

Our project is sponsored by, Dr. WeIChao YunWen, from the UW school of nursing. Based on her research, we learned that there is an opportunity to support caregivers by providing online self-care assistant. We join the COCO project to develop cocobot, a virtual therapy chatbot that provides on-demand, empathetic, and tailored caregiving support. 
As the existing cocobot would teach users to identify problems and set self-care goals through problem-solving therapy, our solution's goal is to help caregivers achieve their self-care goals by raising awareness and form self-care habits. There will be two parts to our solution: a mobile app and an Alexa conversation skill. 

*Mobile APP see [Git Repository](https://gitlab.com/LuWang0211/cocobot_gix_mobileapp.git)

## Main Function

Our team focuses on developing a set of supporting features to keep users motivated to implement their plans and achieve their goals. To help users achieve their goals, we collected and created multimedia self-care resources including guided exercises, calming music, and audio stories. Users can access these resources through either a smartphone or an Alexa-enabled smart speaker.  We also carefully designed the conversations and reminder messages so that users are motivated to stick to their plans. Coco would learn users’ behaviors and preferences based on their rating, browsing and practice history. All these data will be used to help coco provide more personalized recommendations over time.

<!-- ![map](./images/map.JPG) -->

## Implement

In order to import our code to your skills, please follow the official document.
1. Create Alexa Skill Developer Account
Follow insturment from [Alexa Conversations (Beta) Developer Guide](https://developer.amazon.com/en-US/docs/alexa/conversations/about-alexa-conversations.html)
  
2. Installing the code in your own lambda function

To use this code in your own AWS Lambda function, you will need to login to your AWS account and create a lambda function for NodeJS using the latest version and paste the 3 files into the inline editor or upload a zip file containing the files. For more information on setting up lambda functions for use in Alexa skills, please see our documentation: [Host a Custom Skill as an AWS Lambda Function](https://developer.amazon.com/en-US/docs/alexa/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html)

## Reference
Reference Alexa Conversations (Beta) Developer Guide official guide
