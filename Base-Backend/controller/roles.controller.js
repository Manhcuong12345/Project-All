const _ = require('lodash')
const { Role, validate } = require('../model/roles')
const { User } = require('../model/users')


class RoleController {

    static async createRole(req, res, next) {
        const { error } = validate(req.body)
        if (error) return res.status(400).send({ error_code: '01', error_message: error.details[0].message })

        let role = await Role.findOne({ role_name: req.body.role_name })
        if (role) return res.status(400).send({ error_code: '01', error_message: 'Role is alreadt exist!' })

        role = new Role(req.body);
        role.user_updated = req.user._id
        role.user_created = req.user._id
        role = await role.save();
        res.send(role);
    }


    static async getAllRole(req, res, next) {
        const { query } = req
        let { page, limit, search_string } = query
        let skip = 0
        let filter = {}

        if (!page || page <= 0) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }
        if (search_string) {
            filter = { email: { $regex: new RegExp(["", search_string, ""].join(""), "i") } }
        }

        skip = parseInt(page - 1) * parseInt(limit)
        const role = await Role.find(filter)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        const documentCount = await Role.countDocuments(filter)
        let response = {
            data: role,
            meta_data: {
                total_records: documentCount,
                page: page,
                limit: limit,
                total_pages: Math.ceil(documentCount / Number(limit))
            }
        }
        res.send(response)
    }


    static async getRoleById(req, res, next) {
        try {
            const { id } = req.params
            const role = await Role.findById({ _id: id })
            if (!role) res.status(400).send({ error_code: '01', error_message: 'Role not found!' })
            res.send(role)
        } catch (e) {
            return res.status(400).send({ error_code: '01', error_message: 'Role not found!' })
        }
    }


    static async updateRole(req, res, next) {
        if (!req.user.admin) return res.status(400).send({ error_code: '01', error_message: 'Name is already exist!' })

        const { error } = validate(req.body)
        if (error) return res.status(400).send({ error_code: '01', error_message: error.details[0].message })

        const existRole = await Role.findOne({ _id: { $ne: req.body.id }, role_name: req.body.role_name })
        if (existRole) return res.status(400).send({ error_code: '01', error_message: 'Name is already exist!' })

        let fields = req.body
        fields.updated_time = new Date()

        let role = await Role.findById(req.body.id)
        if (!role) return res.status(400).send({ error_code: '01', error_message: 'Role is not found!' })

        Object.assign(role, fields)
        await role.save()

        res.send(role)
    }


    static async deleteRole(req, res, next) {
        try {
            if (!req.user.admin) return res.status(400).send({ error_code: '01', error_message: 'Name is already exist!' })
            const role = await Role.findByIdAndDelete(req.params.id)
            if (!role) return res.status(400).send({ error_code: '01', error_message: 'Role not found' })
            res.send(role)
        } catch (e) {
            return res.status(400).send({ error_code: '01', error_message: 'Role not found!' })
        }

    }
}


exports.RoleController = RoleController
