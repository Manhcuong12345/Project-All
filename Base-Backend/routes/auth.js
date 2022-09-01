const express = require('express')
const router = express.Router()
const {AuthController} = require('../controller/auth.controller')
const passportConfig = require('../middleware/passport')
const passport = require('passport')
const auth = require('../middleware/auth')

router.post('/google',passport.authenticate('google-plus-token',{session:false}),AuthController.authGoogle)
router.post('/facebook',passport.authenticate('facebook-token',{session:false}),AuthController.facebookGoogle)
router.post('/',auth,AuthController.login)

module.exports = router