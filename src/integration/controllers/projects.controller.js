const express = require('express');
const projectsDelegate = require(__base + 'integration/delegates/projects.delegate');

const router = express.Router();

// GET /projects
router.get('/projects', async (req, res, next) => {
    try {
        let projs = await projectsDelegate.getAll();
        res.json(projs);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// GET /projects/<project id>
router.get('/projects/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let proj = await projectsDelegate.get(id);

        res.json(proj);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// POST /projects
router.post('/projects', async (req, res, next) => {
    try {
        let proj = req.body;
        let newProj = await projectsDelegate.create(proj);
        res.status(201).json(newProj);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// PUT /projects/<project id>
router.put('/projects/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let proj = req.body;

        proj = await projectsDelegate.update(proj, id);
        res.json(proj);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// DELETE /projects/<project id>
router.delete('/projects/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        let proj = await projectsDelegate.deleteProject(id);
        res.json(proj);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
