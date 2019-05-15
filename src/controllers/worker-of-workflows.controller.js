const express = require('express');
const workerOfWorkflowsDelegate = require(__base + 'delegates/worker-of-workflows.delegate');

const router = express.Router();

router.post('/worker-of-workflows', async (req, res, next) => {
    try {
        let platform = req.body.platform;
        let job_id = req.body.job_id;
        let worker_id = req.body.worker_id;

        let response = await workerOfWorkflowsDelegate.elaborateWorker(platform, job_id, worker_id);
        res.json(response);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;