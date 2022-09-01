const express = require('express')
const router = express.Router()
const {User} = require('../model/users')


router.post('/',async (req, res) => {
  const user = new User({
    "fullname": "Admin",
    "email": "admin@gmail.com",
    "phone_number": "0585093064",
    "gender": "Male",
    "address": "Nha Trang",
    "password": "admin@admin",
    "admin": true
  })

  await user.hashPassword()
  await user.save()
  res.send(user)
})

module.exports = router