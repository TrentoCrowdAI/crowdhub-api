const express = require('express');
const cacheDelegate = require(__base + 'delegates/cache.delegate');
const {sendRunResultAs} = require(__base + 'controllers/runs.controller.js');

const router = express.Router();

router.get('/cache', async (req, res, next) => {
    try {
        let runId = req.query.runId;
        let cache = await cacheDelegate.getAll(runId, req.user.id);
        res.json(cache);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/cache/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let format = req.query.format;
        let cache = await cacheDelegate.get(id, req.user.id);
        // TODO: Find the block id so we can put it in the filename
        await sendRunResultAs(cache.data, format, `run-#${cache.id_run}-block-#-result`, res);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.delete('/cache/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        let cache = await cacheDelegate.deleteCache(id, req.user.id);
        res.json(cache);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
