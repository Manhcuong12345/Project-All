require('dotenv').config()

module.exports = {
    development:{
        jwt: process.env.JWT_KEY,
        connectingString: process.env.CONNECTION_STRING,
        mailAddress: process.env.MAIL_ADDEESS,
        mailPassword: process.env.MAIL_PASSWORD,
        AccessKeyId1: process.env.SES_AWS_ACCESS_KEY_ID1, 
        SecretAccessKey1: process.env.SES_AWS_SECRET_ACCESS_KEY1,
        Region1: process.env.SES_REGION1,
        Version: process.env.VERSION_API,
        AccountSid: process.env.ACCOUNT_SID,
        AuthToken:process.env.AUTH_TOKEN,
        Phone: process.env.TWILIO_PHONE_NUMBER,
        ResetPass:process.env.RESET_PASSWORD_KEY,
        Google_ClientID:process.env.GOOGLE_CLIENT_ID,
        Client_Secret:process.env.GOOGLE_CLIENT_SECRET,
        FaceBook_ClientID:process.env.FACEBOOK_CLIENT_ID,
        FaceBook_Secret:process.env.FACEBOOK_CLIENT_SECRET
    }
}