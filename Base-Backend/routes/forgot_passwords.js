const express = require('express')
const router = express.Router()
const {AuthController} = require('../controller/auth.controller')
// const auth = require('../midlewares/auth')
// const authoriza = require('../midlewares/authorize')

router.get('/verify-password',AuthController.verifyPassword)
router.post('/',AuthController.forgotPassword)
router.post('/change-password',AuthController.changePassword)

module.exports = router