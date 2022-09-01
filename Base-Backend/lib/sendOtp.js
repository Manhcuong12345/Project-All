// const config = require('../config/config')
// const AWS = require('aws-sdk');

// /**
//  * Function send mail to AWS(Amazon send mail SES)
//  * 
//  */
// async function sendOtp(OTP) {
//     // Thông tin SES_AWS_ACCESS_KEY_ID, SES_AWS_SECRET_ACCESS_KEY
//     const sesConfig = {
//             accessKeyId: config.development.AccessKeyId,
//             secretAccessKey:config.development.SecretAccessKey,
//             region: config.development.Region, // đây là region của server nó là vùng bạn đã chọn khi tạo ses nếu Mumbai là ap-south-1
//         }

//     const sesAws = new AWS.SES(sesConfig);

//     let params = {
//         Destination: {
//         /* required */
//         ToAddresses: [
//         "domanhcuong050400@gmail.com"
//         /* more items */
//         ]
//         },
//         Message: {
//         /* required */
//         Body: {
//         /* required */
//         Html: {
//         Charset: "UTF-8",
//         Data:OTP
//         },
//         // Text: {
//         // Charset: "UTF-8",
//         // Data: `Hi Cuong!
//         // Your Login OTP is 123`
//         // }
//         },
//         Subject: {
//         Charset: 'UTF-8',
//         Data: `The  OTP for Something Something Service Hub!`
//         }
//         },
//         Source: "chaulinhlinh050400@gmail.com",
//         /* required */
//         ReplyToAddresses: [
//             "chaulinhlinh050400@gmail.com"
//         /* more items */
//         ],
//         };

//     const sendPromise = sesAws.sendEmail(params).promise();

//     sendPromise.then(
//         function (data) {
//         console.log(data.MessageId);
//         }).catch(
//         function (err) {
//         console.error(err, err.stack);
//         });
// }
// module.exports = sendOtp
