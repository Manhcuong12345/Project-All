const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')


const RoleSchema = new mongoose.Schema({
    role_name:{
        type:String
    },
    perminssions:[
        {
            model:{
                type:String
            },
            perminssions:{
                add:Boolean,
                edit:Boolean,
                view:Boolean,
                delete:Boolean
            }
        }
    ],
    created_time:{
        type:Date,
        default:Date.now
    },
    updated_time:{
        type:Date,
        default:Date.now
    },
    user_created:{
        type: Schema.ObjectId,
    },
    user_updated:{
        type: Schema.ObjectId,
    }    
})

const Role = mongoose.model('Role',RoleSchema)

function validate(role){
    const schema = Joi.object().keys({
        id:Joi.string().allow(null),
        role_name:Joi.string().min(2).max(200).allow(null).allow(""),
        perminssions:Joi.array().allow(null).allow(""),
        user_created:Joi.string().allow(null).allow(""),
        user_updated:Joi.string().allow(null).allow("")
    })
    return schema.validate(role)
}


exports.Role = Role
exports.validate = validate