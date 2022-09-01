const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
const config = require('../config/config')
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: false
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String,
        max: 500
    },
    password: {
        type: String
    },
    //Them loai dang nhap la gi vi du google hay face
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'], // cho phep gia tri string trung voi 1 trong phan tu array trong enum
        default: 'local'
    },
    authGoogleId: {
        type: String,
        default: null
    },
    authFacebookId: {
        type: String,
        default: null
    },
    tokenAccess: {
        type: String,
        default: null
    },
    roles: [
        {
            type: Schema.ObjectId,
            ref: 'Role'
        }
    ],
    admin: {
        type: Boolean,
        default: false
    },
    birthdate: {
        type: Number
    },
    gender: {
        type: String
    },
    group_users: [
        {
            type: Schema.ObjectId,
            ref: 'User'
        }
    ],
    resetLink: {
        type: String
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    created_time: {
        type: Date,
        default: Date.now()
    },
    otp: {
        type: String,
        default: ''
    },
})

// UserSchema.index({email: 'text'});

UserSchema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id,
        admin: this.admin,
        roles: this.roles
    }, config.development.jwt)
}

UserSchema.methods.hashPassword = async function () {
    //if not local then process to controller is not hash password
    if (this.authType !== 'local') next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}

UserSchema.methods.generatePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema);

function validate(user) {
    const schema = Joi.object().keys({
        id: Joi.string().allow(null).allow(""),
        name: Joi.string().allow(null).allow(""),
        email: Joi.string().email().allow(null).allow(""),
        password: Joi.string().min(6).max(200).allow(null).allow(""),
        phoneNumber: Joi.string().allow(null).allow(""),
        address: Joi.string().max(500).allow(null).allow(""),
        birthdate: Joi.number().allow(null).allow(""),
        gender: Joi.string().allow(null).allow(""),
        admin: Joi.boolean().allow(null).allow(""),
        status: Joi.string().allow(null).allow(""),
        roles: Joi.array().allow(null),
        otp: Joi.string().allow(null).allow("")
    })
    return schema.validate(user)
}

function validateLogin(auth) {
    const schema = Joi.object().keys({
        email: Joi.string().allow(null).allow(""),
        password: Joi.string().min(6).max(200).allow(null).allow("")
    })
    return schema.validate(auth)
}

exports.User = User
exports.validateLogin = validateLogin
exports.validate = validate;

