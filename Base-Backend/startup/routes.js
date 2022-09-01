const express = require('express')
const tests = require('../routes/tests')
const auths = require('../routes/auth')
const registers = require('../routes/register')
const users = require('../routes/users')
const roles = require('../routes/roles')
const forgotpasswords = require('../routes/forgot_passwords')


module.exports = function(app) {
    app.use(express.json())
    app.use('/api/tests',tests)
    app.use('/api/login',auths)
    app.use('/api/registers',registers)
    app.use('/api/users',users)
    app.use('/api/roles',roles)
    app.use('/api/forgot-passwords',forgotpasswords)
    app.use('/api', (req, res) => {
        return res.status(200).json({
          success: true,
          message: 'Welcome to CSPlay API',
        });
    });
}