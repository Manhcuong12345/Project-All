const { User, validate, validateLogin } = require('../model/users')
const _ = require('lodash')
const config = require('../config/config')
const sendSMS = require('../lib/smsMobile')
// const sendOtp = require('../lib/sendOtp')
const sendMail = require('../lib/sendMail')
// const path = require('path')
// const ejs = require('ejs')
const jwt = require('jsonwebtoken')
// const otpGenerator = require('otp-generator')


class AuthController {

    static async login(req, res, next) {
        const { error } = validateLogin(req.body)
        if (error) return res.status({ error_code: '01', error_message: error.details[0].error_message })

        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'Invalid email or password.' })

        const iVaild = await user.generatePassword(req.body.password)
        if (!iVaild) return res.status(400).send({ error_code: '01', error_message: 'Invalid password' })

        const token = user.generateToken()
        const respone = _.pick(user, ['_id', 'email', 'address'])
        res.header('x-auth-token', token).send(respone)
    }

    static async authGoogle(req, res, next) {
        // console.log('auth google',req.user)
        const user = await User.findOne({_id:req.user._id})
        if(!user) return res.status(400).send({ error_code: '01', error_message: 'User not found' })
        console.log(user)
        const token = user.generateToken()
        const respone = _.pick(user, ['email', 'name'])
        res.header('x-auth-token', token).send(respone)
    } 

    static async facebookGoogle(req, res,next) {
        // console.log('facebook',req.user)
        const user = await User.findOne({_id:req.user._id})
        if(!user) return res.status(400).send({ error_code: '01', error_message: 'User not found' })
        console.log(user)
        const token = user.generateToken()
        const respone = _.pick(user, ['email', 'name'])
        res.header('x-auth-token', token).send(respone)
    }
   
    static async registers(req, res, next) {
        const { error } = validate(req.body)
        if (error) return res.status(400).send({ error_code: '01', error_message: error.details[0].message })

        const existUser = await User.findOne({ email:req.body.email, phoneNumber:req.body.phoneNumber })
        if (existUser) return res.status(200).send({ error_code: '01', error_message: 'User is already exist!' })
        
        // `<div class="container" style="max-width: 90%; margin: auto; padding-top: 10px"><h2>Welcome ${user.name} to the website.</h2><h4>You are officially In ✔</h4><p style="margin-bottom: 20px;"></p><h1 style="font-size: 10px">Bạn vui lòng ấn vào đây để đổi mật khẩu:${token}</h1><p style="margin-top:50px;">If you do not request for verification please do not respond to the mail. You can in turn un subscribe to the mailing list and we will never bother you again.</p></div>`
        let fields = req.body
        
        const otp = Math.floor(100000 + Math.random() * 900000)
        let msg = `OTP:${otp}`
        let phone = req.body.phoneNumber
        console.log(phone)
        try {
            sendSMS(msg, phone)
        } catch (err) {
            console.log(err.message)
        }

        // fields.otp= otpGenerator.generate(6, { digits:true,alphabets: false, upperCase: false, specialChars: false })
        let user = new User(fields)
        await user.hashPassword()

        // const otp = Math.floor(100000 + Math.random() * 900000)
        // let msg = `OTP:${otp}`
        // let phone = req.body.phoneNumber
        // console.log(phone)
        // try {
        //     sendSMS(msg, phone)
        // } catch (err) {
        //     console.log(err.message)
        // }

        await user.save()

        res.send(user)

    }

    static async forgotPassword(req, res, next) {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'Email is not found' })

        // let html =  await ejs.renderFile(path.join(__dirname, '../mail/', 'forgot_password.ejs'), { host: req.protocol + '://' + req.get('host') + '/api/forgot-passwords/change-password', id: user._id })
        const token = jwt.sign({ _id: user._id }, config.development.ResetPass, { expiresIn: '2m' })
        let html = `<h4>${user.name}! Please verify your mail to continue..</h4>
                    <a href="http://${req.headers.host}/forgot-passwords/verify-email?token=${token}">Reset Password</a>`

        const resetPass = await user.updateOne({ resetLink: token })
        if (!resetPass) return res.status(400).send({ error_code: '01', error_message: 'reset password link error' })

        try {
            sendMail(email, html)
        } catch (err) {
            console.log(err.message)
        }

        res.send('success')
    }

    static async verifyPassword(req, res, next) {
        const token = req.query.token
        const user = await User.findOne({resetLink:token})
        if(!user) return res.status(400).send({ error_code: '01', error_message: 'Not send change-password'})
        res.send('success')
    }

    static async changePassword(req, res, next) {
        const { resetLink, password } = req.body

        // const decode = jwt.verify(resetLink, config.development.ResetPass)
        // console.log(decode)
        // if (!decode) return res.status(400).send({ error_code: '01', error_message: 'Token is invalid' })

        let user = await User.findOne({ resetLink:resetLink })
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'User with token is not exist' })

        user.password = password
        await user.hashPassword()

        await user.save()
        res.send('success')
    }

}

exports.AuthController = AuthController

