
function authorize(model, action) {
    return (req, res, next) => {
        let perminssions = []
        const { user } = req
        if (user.admin) return next();
        if (action == "admin") return res.status(401).send({ error_code: "02", error_message: 'Unauthorized' });

        if (user.roles.length === 0) {
            return res.status(401).send({ error_code: "02", error_message: 'Unauthorized' });
        }

        user.roles.forEach(role => {
            if (role.perminssions.length > 0) {
                perminssions = perminssions.concat(role.perminssions)
            }
        })

        const allow = perminssions.find(permission => permission.model == model && permission.perminssions[action])
        if (!allow) {
            return res.status(401).send({ error_code: '02', error_message: 'Unauthorized' })
        }

        return next();
    }
}

module.exports = authorize;
