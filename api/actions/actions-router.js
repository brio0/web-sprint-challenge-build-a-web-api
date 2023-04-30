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

router.post('/', (req, res) => {
    const { description, notes, completed } = req.body
    if (!description || !notes) {
        res.status(400).json({
            message: "Please provide description, notes, and completed"
        })
    } else {
        Actions.insert({ completed, description, notes })
            .then(({ id }) => {
                return Actions.get(id)
            })
            .then(action => {
                const projectId =
                    res.status(200).json(action)
            })
            .catch(err => {
                res.status(500).json({
                    message: "error creating action",
                    err: req.params,
                    stack: err.stack

                })
            })
    }
})


router.put('/:id', (req, res) => {
    const { description, notes, completed } = req.body
    if (!description || !notes) {
        res.status(400).json({
            message: "Please provide description notes and completed"
        })
    } else {
        Actions.get(req.params.id)
            .then(stuff => {
                if (!stuff) {
                    res.status(404).json({
                        message: "The action with specific id does not exist"
                    })
                } else {
                    return Actions.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data)
                    return Actions.get(req.params.id)
            })
            .then(action => {
                if (action) {
                    res.json(action)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "The action information could not be retrieved",
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const action = await Actions.get(req.params.id)
        if (!action) {
            res.status(404).json({
                message: "The action with specified id does not exist"
            })
        } else {
            await Actions.remove(req.params.id)
            res.json(action)
        }
    } catch (err) {
        res.status(500).json({
            message: "This project could not be deleted",
            err: err.message,
            stack: err.stack
        })
    }
})








module.exports = router