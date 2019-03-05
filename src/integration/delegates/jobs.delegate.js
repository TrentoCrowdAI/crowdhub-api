// this modules is responsible for allowing to publish HITs in
// any of the supported platforms. Also to implement any other 
// functionality related to HITs.

const jobs_dao = require("../dao/jobs.dao");

const publish = async () => {
  // TODO
};

const createJob = async (job) => {
  const error = new Error();
  error.httpStatusCode = 400;

  if (job === null || job === undefined) {
    error.message = 'Job not defined!';
  }
  if (!(job.data instanceof Object)) {
    error.message = 'Job data not defined!';
  }

  //throw error only if necessary
  if(error.message != "")
    throw error;

  let new_job = await jobs_dao.createJob(job);
  return new_job;
};

module.exports = {
  publish,
  createJob
};