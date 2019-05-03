const express = require('express');
const runsDelegate = require(__base + 'delegates/runs.delegate');

const router = express.Router();

router.get('/runs', async (req, res, next) => {
    try {
        let workflowId = req.query.workflowId;
        let runs = await runsDelegate.getAll(workflowId);
        res.json(runs);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.get('/runs/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let run = await runsDelegate.get(id);

        res.json(run);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.get('/runs/:id/result', async (req, res, next) => {
    try {
        let id = req.params.id;

        let result = await runsDelegate.getResult(id);
        res.json(result);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;