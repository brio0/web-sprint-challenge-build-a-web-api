// Write your "projects" router here!

const express = require('express')
const Project = require('./projects-model')

const router = express.Router()

router.get('/', (req, res, next) => {
    Project.get()
        .then(project => {
            if (project) {
                res.status(200).json(project)
            } else {
                return []
            }
        })
        .catch(next)
})

router.get('/:id', async (req, res, next) => {
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
        next(err)
    }

})

router.post('/', (req, res, next) => {
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
            .catch(next)
    }
})

router.put('/:id', (req, res, next) => {
    const { name, description, completed } = req.body
    if (!name || !description || typeof completed !== "boolean") {
        res.status(400).json({
            message: "Please provide name, description, and completed"
        })
    } else {
        Project.get(req.params.id)
            .then(stuff => {
                if (!stuff) {
                    res.status(404).json({
                        message: "The post with specific ID does not exist"
                    })
                } else {
                    return Project.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data)
                    return Project.get(req.params.id)
            })
            .then(project => {
                if (project) {
                    res.json(project)
                }
            })
            .catch(next)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const project = await Project.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: "The project with specified id does not exist"
            })
        } else {
            await Project.remove(req.params.id)
            res.json(project)
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id/actions', async (req, res, next) => {
    try {
        const action = await Project.get(req.params.id);
        if (!action) {
            res.status(404).json({
                message: "The action with specified id does not exist"
            })
        } else {
            const project = await Project.getProjectActions(req.params.id)
            res.json(project)
        }
    } catch (err) {
        next(err)
    }
})

router.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message,
        customMessage: "Something went wrong in projects router"
    })
})


module.exports = router
