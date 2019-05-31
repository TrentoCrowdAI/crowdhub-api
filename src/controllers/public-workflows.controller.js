const express = require('express');
const workflowsDelegate = require(__base + 'delegates/workflows.delegate');

const router = express.Router();

router.get('/public-workflows', async (req, res, next) => {
    try {
        let works = await workflowsDelegate.getAllPublic();
        res.json(works);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/public-workflows/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let work = await workflowsDelegate.getPublic(id);

        res.json(work);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;