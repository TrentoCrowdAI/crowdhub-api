const express = require('express');
const workflowsDelegate = require(__base + 'delegates/workflows.delegate');

const router = express.Router();

router.get('/workflows', async (req, res, next) => {
    try {
        let projectId = req.query.projectId;
        let works = await workflowsDelegate.getAll(projectId, req.user.id);
        res.json(works);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/workflows/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let work = await workflowsDelegate.get(id, req.user.id);

        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/workflows', async (req, res, next) => {
    try {
        let work = req.body;
        let newWork = await workflowsDelegate.create(work, req.user.id);
        res.status(201).json(newWork);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.put('/workflows/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let work = req.body;

        work = await workflowsDelegate.update(work, id, req.user.id);
        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.delete('/workflows/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        let work = await workflowsDelegate.deleteWorkflow(id, req.user.id);
        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/workflows/:id/start', async (req, res, next) => {
    try {
        let id = req.params.id;

        let runId = await workflowsDelegate.start(id, req.user.id);
        res.status(202).json(runId); //accepted
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/workflows/:idWork/:idBlock/estimated-cost', async (req, res, next) => {
    try {
        let workId = req.params.idWork;
        let blockId = req.params.idBlock;

        let result = await workflowsDelegate.estimateDoBlockCost(workId, blockId, req.user.id);
        res.json(result);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;