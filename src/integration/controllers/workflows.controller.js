const express = require('express');
const workflowsDelegate = require(__base + 'integration/delegates/workflows.delegate');

const router = express.Router();

router.get('/workflows', async (req, res, next) => {
    try {
        let works = await workflowsDelegate.getAll();
        res.json(works);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/workflows/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let work = await workflowsDelegate.get(id);

        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/workflows', async (req, res, next) => {
    try {
        let work = req.body;
        let newWork = await workflowsDelegate.create(work);
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

        work = await workflowsDelegate.update(work, id);
        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.delete('/workflows/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        work = await workflowsDelegate.deleteWorkflow(id);
        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/workflows/:id/start', async (req, res, next) => {
    try {
        let id = req.params.id;

        work = await workflowsDelegate.start(id);
        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;