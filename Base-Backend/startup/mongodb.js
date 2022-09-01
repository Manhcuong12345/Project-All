const mongoose = require('mongoose')
const config = require('../config/config')

module.exports = async function(){
    try{
        await mongoose.connect(config.development.connectingString,{
            autoReconnect: true,
            useCreateIndex: true,
            bufferMaxEntries: 0,
            bufferCommands: false,
            useNewUrlParser: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        console.log('connect successful to !!!',config.development.connectingString)

        const db = mongoose.connection;

        // When the mongodb server goes down, the driver emits a 'close' event
        db.on('close', () => { console.log('-> lost connection'); });
        // The driver tries to automatically reconnect by default, so when the
        // server starts the driver will reconnect and emit a 'reconnect' event.
        db.on('reconnect', () => { console.log('-> reconnected'); });
        db.on('error', () => { console.log('-> error connection'); });
        db.on('reconnectFailed', async () => {
            console.log('-> gave up reconnecting');
        });
    }catch(err) {
       console.log('connect unsuccessfull!!',err)
}
}