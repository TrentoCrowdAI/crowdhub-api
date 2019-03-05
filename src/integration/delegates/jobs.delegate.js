// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const jobsDao = require("../dao/jobs.dao");

const publish = async () => {
  // TODO
};

const createJob = async (job) => {
  const error = new Error();
  error.httpStatusCode = 400;

  if (!(job instanceof Object)) {
    error.message = 'Job not defined!';
  }
  else if (!(job.data instanceof Object)) {
    error.message = 'Job data not defined!';
  }
  else if (job.data.name === undefined) {
    error.message = 'Job name not defined!';
  }
  else if (job.data.reward === undefined) {
    error.message = 'Job reward not defined!';
  }
  else if (job.data.items_csv === undefined) {
    error.message = 'Items CSV path not defined!';
  }

  //throw error only if necessary
  if(error.message != "")
    throw error;

  let newJob = await jobsDao.createJob(job);
  return newJob;
};

module.exports = {
  publish,
  createJob
};