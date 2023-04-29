// Write your "projects" router here!

const express = require('express')
const Project = require('./projects-model')

const router = express.Router()

router.get('/', (req, res) => {
    Project.get()
        .then(project => {
            if (project) {
                res.status(200).json(project)
            } else {
                return []
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'cant'
            })
        })
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const projects = await Project.get(id)
        if (projects) {
            res.status(200).json(projects)
        } else {
            res.status(404).json({
                message: `no project with id: ${id}`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: 'error'
        })
    }

})

router.post('/', (req, res) => {
    const { name, description, completed } = req.body
    if (!name || !description) {
        res.status(400).json({
            message: "Please provide name, description, and completed"
        })
    } else {
        Project.insert({ name, description, completed })
            .then(({ id }) => {
                return Project.get(id)
            })
            .then(project => {
                res.status(200).json(project)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an issue while saving project to database",
                    err: err.message,
                    stack: err.stack
                })
            })
    }
})




module.exports = router
