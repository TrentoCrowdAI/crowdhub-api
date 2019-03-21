// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const jobsDao = require(__base + 'integration/dao/jobs.dao');
const errHandler = require(__base + 'utils/errors');

const f8 = require(__base + 'integration/platforms/f8');
const toloka = require(__base + 'integration/platforms/toloka');

const publish = async (job, platform) => {
  checkJobParams(job);

  if (platform === undefined) {
    throw errHandler.createBusinessError('Platform not defined!');
  }

  try {
    if (platform == 'F8') {
      //f8 publishing
      job = await f8.publish(job);
    }
    else if (platform == 'Toloka') {
      //toloka publishing
      job = await toloka.publish(job);
    }
    else if (platform == 'MTurk') {
      //TODO

    }
    else {
      throw new Error('Invalid platform!');
    }

    //update job with platform info
    job = await jobsDao.updateJob(job);
  }
  catch (e) {
    throw errHandler.createBusinessError(e.message);
  }

  return job;
};

const createJob = async (job) => {
  checkJobParams(job);

  let newJob = await jobsDao.createJob(job);
  return newJob;
};

const getJob = async (jobId) => {
  jobId = parseInt(jobId);
  if (typeof jobId != "number" || isNaN(jobId)) {
    throw errHandler.createBusinessError('Job id is of an invalid type!');
  }

  let job = await jobsDao.getJob(jobId);

  if (!job)
    throw errHandler.createBusinessNotFoundError('Job id does not exist!');

  return job;
};

const deleteJob = async (jobId) => {
  jobId = parseInt(jobId);
  if (typeof jobId != "number" || isNaN(jobId)) {
    throw errHandler.createBusinessError('Job id is of an invalid type!');
  }

  let job = await jobsDao.deleteJob(jobId);

  if (!job)
    throw errHandler.createBusinessNotFoundError('Job id does not exist!');

  return job;
};

const updateJob = async (job, jobId) => {
  checkJobParams(job);

  jobId = parseInt(jobId);
  if (typeof jobId != "number" || isNaN(jobId)) {
    throw errHandler.createBusinessError('Job id is of an invalid type!');
  }

  job.id = jobId;

  job = await jobsDao.updateJob(job);

  if (!job)
    throw errHandler.createBusinessNotFoundError('Job id does not exist!');

  return job;
};

const checkJobParams = (job) => {
  if (!(job instanceof Object)) {
    throw errHandler.createBusinessError('Job not defined or not valid!');
  }
  if (!(job.data instanceof Object)) {
    throw errHandler.createBusinessError('Job data not defined or not valid!');
  }
  if (typeof job.data.name != "string") {
    throw errHandler.createBusinessError('Name of the job not defined or not valid!');
  }
  if (typeof job.data.description != "string") {
    throw errHandler.createBusinessError('Description not defined or not valid!');
  }
  if (typeof job.data.numVotes != "number") {
    throw errHandler.createBusinessError('NumVotes not defined or not valid!');
  }
  if (typeof job.data.maxVotes != "number") {
    throw errHandler.createBusinessError('MaxVotes not defined or not valid!');
  }
  if (typeof job.data.reward != "number") {
    throw errHandler.createBusinessError('Reward not defined or not valid!');
  }
  if (typeof job.data.items_csv != "string") {
    throw errHandler.createBusinessError('Items CSV URL not defined or not valid!');
  }
  if (typeof job.data.items_gold_csv != "string") {
    throw errHandler.createBusinessError('Items Gold CSV URL not defined or not valid!');
  }
  if (!(job.data.design instanceof Object)) {
    throw errHandler.createBusinessError('Design not defined or not valid!');
  }
  if (typeof job.data.instructions != "string") {
    throw errHandler.createBusinessError('Instructions not defined or not valid!');
  }

  checkJobMarkup(job);
};

const checkJobMarkup = (job) => {

};


const getJobs = async () => {
  return await jobsDao.getJobs();
};

module.exports = {
  publish,
  createJob,
  getJob,
  getJobs,
  deleteJob,
  updateJob
};