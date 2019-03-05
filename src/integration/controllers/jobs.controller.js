// this file exposes the logic implemented in jobs.delegate.js
// as services using express

const express = require('express');
const jobsDelegate = require('../delegates/jobs.delegate');

const router = express.Router();

// GET /jobs
// GET /jobs/<job id>

// POST /jobs
router.post('/jobs', async (req, res, next) => {
  try {
    let job = req.body;
    let newJob = await jobsDelegate.createJob(job);
    res.json(newJob);
  } catch (e) {
    // we delegate to the error-handling middleware
    next(e);
  }
});

// PUT /jobs/<job id>
// DELETE /jobs/<job id>
// POST   /jobs/<job id>/publish

module.exports = router;
