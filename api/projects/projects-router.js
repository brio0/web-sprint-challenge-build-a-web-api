// Write your "projects" router here!

const express = require('express')
const Project = require('./projects-model')

const router = express.Router()

router.get('/', (req, res) => {
    Project.get()
        .then(project => {
            res.status(200).json(project)
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





module.exports = router
