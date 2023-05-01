// Write your "actions" router here!
const express = require('express')
const { checkActionsId } = require('./actions-middlware')
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

router.get('/:id', checkActionsId, (req, res, next) => {
    res.json(req.action)
})

router.post('/', async (req, res) => {
    try {
        const { description, completed, notes, project_id } = req.body
        if (!description || !notes) {
            res.status(400).json({
                message: "err"
            })
        } else {
            const action = await Actions.insert({ completed, description, notes, project_id })
            if (project_id) {
                res.status(201).json(action)
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Error while posting new action",
            err: err.message,
            stack: err.stack
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

router.delete('/:id', checkActionsId, (req, res) => {
    Actions.remove(req.params.id)
        .then(() => {
            res.status(200).json({ message: "the action has been deleted " })
        })
        .catch(err => {
            res.status(500).json({
                message: "This project could not be deleted",
                err: err.message,
                stack: err.stack
            })
        })
})








module.exports = router