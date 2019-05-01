const express = require('express');
const cacheDelegate = require(__base + 'delegates/cache.delegate');

const router = express.Router();

router.get('/cache', async (req, res, next) => {
    try {
        let runId = req.query.runId;
        let cache = await cacheDelegate.getAll(runId);
        res.json(cache);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/cache/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let cache = await cacheDelegate.get(id);

        res.json(cache);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.delete('/cache/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        let cache = await cacheDelegate.deleteCache(id);
        res.json(cache);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;