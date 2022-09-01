const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../model/users')
const moment = require('moment')


async function auth(req, res, next) {
    const token = req.header('x-auth-token')
    // console.log(token)
    if (!token) return res.status(400).send({ error_code: '01', error_message: 'unauthorized' })

    try {
        const payload = jwt.verify(token, config.development.jwt)
        req.user = payload

        // const user = await User.findById(payload._id);
        // if (!user) return res.status(400).send({ error_code: "01", error_message: "token expired" })
        
        //Để có được ngày và giờ hiện tại, chỉ cần gọi moment () mà không có tham số.
        const now = moment()
        const tokenCreateTime = moment(payload.iat * 1000)

        if (now.diff(tokenCreateTime, 'minutes') > 43200) return res.status(400).send({ error_code: "01", error_message: "token expired" });
        next();
    } catch (err) {
        console.log(err.message)
        return res.status(401).send({ error_code: '01', error_message: 'unauthorized' })

    }

    // const token = req.header('x-auth-token');
    // if (!token) return res.status(401).send({error_code: "01", error_message: "unauthorized"});

    // try {
    //     const payload = jwt.verify(token, config.development.jwtKey);
    //     req.user = payload;
    //     if(!payload.admin){
    //         req.body.chain = payload.chain;
    //     }
    //     req.body.user_created = payload._id;
    //     req.body.user_updated = payload._id;
    //     const user = await User.findById(payload._id);
    //     if(!user) return res.status(400).send({error_code: "01", error_message: "token expired"})
    //     const now = moment();
    //     const tokenCreateTime = moment(payload.iat * 1000);
    //     const haveLastUpdatedToken = user.last_updated_roles.toString() != new Date().toString()
    //     if(!user.admin && haveLastUpdatedToken && moment(user.last_updated_roles).isAfter(tokenCreateTime)) 
    //         return res.status(400).send({error_code: "01", error_message: "token expired"});
    //     //console.log(now.diff(tokenCreateTime, 'minutes'));
    //     if (now.diff(tokenCreateTime, 'minutes') > 43200) return res.status(400).send({error_code: "01", error_message: "token expired"});
    //     next();
    // } catch (ex) {
    //     console.log(ex.message)
    //     return res.status(400).send({error_code: "01", error_message: "invalid token"});
    // }
}

module.exports = auth