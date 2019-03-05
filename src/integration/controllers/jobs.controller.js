// this file exposes the logic implemented in jobs.delegate.js 
// as services using express

const express = require("express");
const Boom = require('boom');
const jobs_delegate = require("../delegates/jobs.delegate");

const router = express.Router();

// GET /jobs
// GET /jobs/<job id>

// POST /jobs
router.post('/jobs', async (req, res) => {
    let job = req.body;

    jobs_delegate.createJob(job).then((new_job) => {
        res.json(new_job);
    }).catch((err) => {
        res.status(err.httpStatusCode).send(err.message);
    });
});

// PUT /jobs/<job id>
// DELETE /jobs/<job id>



// POST   /jobs/<job id>/publish


module.exports = router;