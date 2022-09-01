const express = require('express')
const { UserController } = require('../controller/users.controller')
const router = express.Router()
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')

router.get('/', auth, UserController.getAllUser)
router.get('/me',auth, UserController.getUserByToken)
router.put('/me',auth,UserController.updateUserByToken)
router.get('/:id', auth, UserController.getUserById)
router.post('/', auth, UserController.createUser)
router.put('/', auth, authorize('User', 'admin'), UserController.updateUser)
router.delete('/:id', auth, authorize('User', 'admin'), UserController.deleteUser)


module.exports = router