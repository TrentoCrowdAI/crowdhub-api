// this file exposes the logic implemented in jobs.delegate.js 
// as services using express

const express = require('express');
const jobsDelegate = require('../delegates/jobs.delegate');
const errHandler = require(__base + 'utils/errors');

const router = express.Router();

// GET /jobs
// GET /jobs/<job id>

// POST /jobs
router.post('/jobs', async (req, res) => {
    let job = req.body;

    try{
        let newJob = await jobsDelegate.createJob(job);
        res.json(newJob);
    }
    catch(e){
        throw errHandler.createServiceError(e);
    }
});

// PUT /jobs/<job id>
// DELETE /jobs/<job id>



// POST   /jobs/<job id>/publish


module.exports = router;