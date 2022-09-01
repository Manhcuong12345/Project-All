const express = require('express')
const router = express.Router()
const {AuthController} = require('../controller/auth.controller')

router.post('/',AuthController.registers)

module.exports = router