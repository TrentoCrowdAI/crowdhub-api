const { getPool, getPoolResponses, closePool } = require(__base +
  'platform-api/toloka');

const sleep = require(__base + 'utils/utils').sleep;

const wait = async (blockData, input) => {
  let result;
  let pool = input.taskPool;
  let done = false;
  while (!done) {
    await sleep(1000 * 20); // TODO: the value 20 should be in the config file.
    try {
      done = await checkFinished(pool, blockData.sandbox);
      result = await getPoolResponses(pool, blockData.sandbox);
    } catch (err) {
      console.error(err);
      done = false;
    }
  }

  return result;
};

const checkFinished = async (pool, sandbox) => {
  pool = await getPool(pool, sandbox);
  console.info('Running checkFinished for pool: \n', pool);
  return (
    (pool.status === 'CLOSED' && pool.last_close_reason === 'COMPLETED') ||
    pool.status === 'ARCHIVED'
  );
};

module.exports = wait;
