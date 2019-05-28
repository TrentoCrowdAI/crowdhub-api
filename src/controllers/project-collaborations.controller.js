const express = require('express');
const collaborationsDelegate = require(__base + 'delegates/project-collaborations.delegate');

const router = express.Router();

router.get('/project-collaborations', async (req, res, next) => {
    try {
        let projectId = req.query.projectId;
        let collabs = await collaborationsDelegate.getAllByProject(projectId, req.user.id);
        res.json(collabs);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/project-collaborations/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let collab = await collaborationsDelegate.get(id, req.user.id);
        res.json(collab);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/project-collaborations', async (req, res, next) => {
    try {
        let userId = req.body.userId;
        let projectId = req.body.projectId;

        let collab = await collaborationsDelegate.create(userId, projectId, req.user.id);
        res.status(201).json(collab);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.delete('/project-collaborations/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let collab = await collaborationsDelegate.deleteCollaboration(id, req.user.id);
        res.json(collab);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
