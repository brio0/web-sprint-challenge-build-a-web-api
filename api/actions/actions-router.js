// Write your "actions" router here!
const express = require('express')
const Actions = require('./actions-model')

const router = express.Router()

router.get('/', (req, res) => {
    Actions.get()
        .then(action => {
            if (action) {
                res.status(200).json(action)
            } else {
                return []
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "error fetching actions",
                err: err.message,
                stack: err.stack
            })
        })
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const actions = await Actions.get(id)
        if (actions) {
            res.status(200).json(actions)
        } else {
            res.status(404).json({
                message: `no actions with id: ${id}`
            })
        }
    } catch {
        res.status(500).json({
            message: 'error fetching action',
            err: err.message,
            stack: err.stack
        })
    }
})








module.exports = router