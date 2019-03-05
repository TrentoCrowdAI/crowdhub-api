// this file exposes the logic implemented in jobs.delegate.js 
// as services using express

const express = require("express");
const Boom = require('boom');
const jobsDelegate = require("../delegates/jobs.delegate");

const router = express.Router();

// GET /jobs
// GET /jobs/<job id>

// POST /jobs
router.post('/jobs', async (req, res) => {
    let job = req.body;

    jobsDelegate.createJob(job).then((newJob) => {
        res.json(newJob);
    }).catch((err) => {
        res.status(err.httpStatusCode).send(err.message);
    });
});

// PUT /jobs/<job id>
// DELETE /jobs/<job id>



// POST   /jobs/<job id>/publish


module.exports = router;