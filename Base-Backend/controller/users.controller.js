const _ = require('lodash')
const { User, validate } = require('../model/users')


class UserController {

    //lay ra id cua user profile do
    static async getUserByToken(req, res, next) {
        try {
            const { _id } = req.user
            const user = await User.findById(_id).select("-password")
            if (!user) return res.status(400).send({ error_code: '01', error_message: 'User is not found!' })
            res.send(user)
        } catch (error) {
            return res.status(400).send({ error_code: '01', error_message: 'User is not found!' })
        }
    }

    static async updateUserByToken(req, res, next) {
        const id = req.user._id

        const { error } = validate(req.body)
        if (error) return res.status(400).send({ error_code: '01', error_message: error.details[0].message })

        const fields = _.pick(req.body, ['fullname', 'address', 'email', 'phone_number', 'gender', 'roles', 'status'])
        const user = await User.findByIdAndUpdate(id, fields).select("-password")
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'User is not found!' })

        res.send(user)
    }

    static async createUser(req, res, next) {
        const { error } = validate(req.body)
        if (error) return res.status(400).send({ error_code: '01', error_message: error.details[0].message })

        const existUser = await User.findOne({ email: req.body.email }).select({ _id: 1 })
        if (existUser) return res.status(200).send({ error_code: '01', error_message: 'User is already exist!' })

        const fields = _.pick(req.body, ['fullname', 'address', 'phone_number', 'email', 'password', 'type', 'website', 'account_email', 'gender', 'status', 'job', 'birthdate'])

        let user = new User(fields)
        await user.hashPassword()
        await user.save()

        res.send(user)

    }

    static async getAllUser(req, res, next) {
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
            if (search_string.includes('@')) search_string = search_string.substring(0, search_string.indexOf('@'))
            filter.$text = { $search: search_string }
            filter = { email: { $regex: new RegExp(["", search_string, ""].join(""), "i") } }
        }

        skip = parseInt(page - 1) * parseInt(limit)
        const user = await User.find(filter).populate('group_users')
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        const documentCount = await User.countDocuments(filter)
        let response = {
            data: user,
            meta_data: {
                total_records: documentCount,
                page: page,
                limit: limit,
                total_pages: Math.ceil(documentCount / Number(limit))
            }
        }
        res.send(response)
    }

    static async updateUser(req, res, next) {
        const { error } = validate(req.body)
        if (error) return res.status(400).send({ error_code: '01', error_message: error.details[0].message })

        const existUser = await User.findOne({ _id: { $ne: req.body.id }, email: req.body.email, company: req.user.company })
        if (existUser) return res.status(200).send({ error_code: '01', error_message: 'User is already exist!' })

        const fields = req.body
        const user = await User.findById(req.body.id)
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'User is not found!' })

        Object.assign(user, fields)
        await user.save()

        res.send(user)
    }

    static async getUserById(req, res, next) {
        const { id } = req.params
        const user = await User.findById(id).select("-password")
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'User is not found!' })

        res.send(user)
    }

    static async deleteUser(req, res, next) {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id).select("-password")
        if (!user) return res.status(400).send({ error_code: '01', error_message: 'User is not found!' })

        res.send(user)
    }
}

exports.UserController = UserController