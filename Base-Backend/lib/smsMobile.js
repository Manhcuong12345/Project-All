const config = require('../config/config')
const AWS = require('aws-sdk')
const twilio = require('twilio')(config.development.AccountSid,config.development.AuthToken)

async function sendSMS(msg,phone) {
    
    twilio.messages.create({
     body: msg,
     from: config.development.Phone,
     to: phone
   })
  .then(message => console.log(message.sid));

    // const sns = new AWS.SNS({
    //     apiVersion: config.development.Version,
    //     region: config.development.Region1,
    //     accessKeyId: config.development.AccessKeyId1,
    //     secretAccessKey: config.development.SecretAccessKey1
    // })

    // phoneNumber = "+84" + phoneNumber;

//     var params = {
//         Message: msg,
//         PhoneNumber: phone,
//         MessageAttributes:{
//             'AWS.SNS.SMS.SenderID': { 'DataType': 'String', 'StringValue': 'cuongdomanh' },
//             'AWS.SNS.SMS.SMSType': { 'DataType': 'String', 'StringValue': 'Transactional' }
//             // 'AWS.SNS.SMS.SMSType': {'DataType': 'String', 'StringValue': 'Promotion'}
//     }
// }
    // Create promise and SNS service object
    // var publishTextPromise = sns.publish(params).promise();
    // // Handle promise's fulfilled/rejected states
    // publishTextPromise.then(
    //     function(data) {
    //       console.log("MessageID is " + data.MessageId);
    //     }).catch(
    //       function(err) {
    //       console.error(err, err.stack);
    //     });

}

module.exports = sendSMS