// this file exposes the logic implemented in jobs.delegate.js
// as services using express

const express = require('express');
const jobsDelegate = require(__base + 'integration/delegates/jobs.delegate');

const router = express.Router();

// GET /jobs
router.get('/jobs', async (req, res, next) => {
    try {
        let jobs = await jobsDelegate.getJobs();
        res.json(jobs);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// GET /jobs/<job id>
router.get('/jobs/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let job = await jobsDelegate.getJob(id);

        res.json(job);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// POST /jobs
router.post('/jobs', async (req, res, next) => {
    try {
        let job = req.body;
        let newJob = await jobsDelegate.createJob(job);
        res.status(201).json(newJob);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// PUT /jobs/<job id>
router.put('/jobs/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let job = req.body;

        job = await jobsDelegate.updateJob(job, id);
        res.json(job);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// DELETE /jobs/<job id>
router.delete('/jobs/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        job = await jobsDelegate.deleteJob(id);
        res.json(job);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});


// POST   /jobs/<job id>/publish
router.post('/jobs/:id/publish', async (req, res, next) => {
    try {
        let id = req.params.id;
        let platform = req.body.platform;
        let job = await jobsDelegate.getJob(id);

        let pubRes = await jobsDelegate.publish(job, platform);
        res.json(pubRes);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
