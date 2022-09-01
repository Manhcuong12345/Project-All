const express = require('express')
const router = express.Router()
const { RoleController } = require('../controller/roles.controller')
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')

router.get('/', auth, authorize('Role', 'admin'), RoleController.getAllRole)
router.post('/', auth, authorize('Role', 'admin'), RoleController.createRole)
router.put('/', auth, authorize('Role', 'admin'), RoleController.updateRole)
router.get('/:id', auth, authorize('Role', 'admin'), RoleController.getRoleById)
router.delete('/:id', auth, authorize('Role', 'admin'), RoleController.deleteRole)

module.exports = router