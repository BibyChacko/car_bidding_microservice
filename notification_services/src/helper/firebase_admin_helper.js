const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../credentials/carbidding_service_account_key.json");

exports.initializeFirebaseApp = () => {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });
};

exports.sendMessageToDevice = async (
  deviceToken,
  title,
  body,
  imageUrl,
  miscData,
  messagingOptions
) => {
  try {
    // Result will be  a messageId when send successfully
    const result = await firebaseAdmin
      .messaging()
      .send({
        token: deviceToken,
        notification: { title: title, body: body, imageUrl: imageUrl },
        data: miscData,
      });
  } catch (error) {
    console.error(error);
  }
};

exports.sendMessageToMultipleDevices = async (
  deviceTokenList,
  title,
  body,
  imageUrl,
  miscData,
  messagingOptions
) => {
  try {
    // batchResults is  a list of tokens that corresponds to the order of the input tokens.
    // It contains  responses: SendResponse[],   successCount: number,   failureCount: number
    // SendResponse --   success: boolean,  messageId?: string,   error?: FirebaseError
    const batchResults = await firebaseAdmin
      .messaging()
      .sendEachForMulticast({
        tokens: deviceTokenList,
        notification: { title: title, body: body, imageUrl: imageUrl },
        data: miscData,
      });
  } catch (error) {
    console.error(error);
    // TODO: Add a logger here for catching these error events
  }
};

exports.sendMessageToTopic = async (
  topic,
  title,
  body,
  imageUrl,
  miscData,
  messagingOptions
) => {
  try {
    // resposne is MessagingTopicResponse , which contain a messageId , can acess it as response.messageId
    const response = await firebaseAdmin
      .messaging()
      .sendToTopic({
        topic: topic,
        notification: { title: title, body: body, imageUrl: imageUrl },
        data: miscData,
      });
  } catch (error) {
    console.error(error);
    // TODO: Add a logger here for catching these error events
  }
};
