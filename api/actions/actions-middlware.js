// add middlewares here related to actions
const Actions = require('./actions-model')

async function checkActionsId(req, res, next) {
    try {
        const action = await Actions.get(req.params.id)
        if (action) {
            req.action = action
            next()
        } else {
            next({ status: 404, message: `Action ${req.params.id} not found` })
        }
    } catch (err) {
        next(err);
    }
}





module.exports = {
    checkActionsId,
}