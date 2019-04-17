const { createProject, createTaskPool, createTasks } = require('./toloka-api');
const renderDesign = require('./render');

/**
 * Publish the job parameter on the Toloka platform as a new job.
 * @param {{}} job
 */
const publish = async (job) => {
  let param = renderDesign(job);
  job = await createProject(job, param);

  job = await createTaskPool(job);

  let tasks = await csvToTasks(job, job.data.items_csv, param);
  let gold_tasks = await csvToTasks(job, job.data.items_gold_csv, param);

  job = await createTasks(job, tasks, param);
  job = await createTasks(job, gold_tasks, param);

  return job;
};

/**
 * Convert a CSV file for F8 to an array of Toloka tasks
 * @param {{}} job
 * @param {String} csvFile URL to the CSV file
 * @param {{}} inOutParams input and output Toloka fields
 */
const csvToTasks = async (job, csvFile, inOutParams) => {
  let tasks = [];

  let csvReq = await fetch(csvFile);
  let csvData = await csvReq.text();
  let data = await neatCsv(csvData);

  for (let el of data) {
    let headers = Object.keys(el);

    let task = {
      pool_id: job.data.platform.toloka.pool.id,
      input_values: {},
      overlap: 1
    };

    for (let key of headers) {
      if (Object.keys(inOutParams.input_spec).indexOf(key) != -1) {
        task.input_values[key] = el[key];
      } else if (key.endsWith('_gold')) {
        //gold item
        pos = key.indexOf('_gold');

        let fieldName = key.substring(0, pos);
        if (Object.keys(inOutParams.output_spec).indexOf(fieldName) != -1) {
          if (task.known_solutions === undefined)
            task.known_solutions = [{ output_values: {}, correctness_weight: 1 }];

          task.known_solutions[0].output_values[fieldName] = el[key];
        }
      }
    }

    if (task.known_solutions !== undefined) {
      //fill with missing gold items in order to avoid errors
      for (let gold of Object.keys(inOutParams.output_spec)) {
        if (task.known_solutions[0].output_values[gold] === undefined)
          task.known_solutions[0].output_values[gold] = '';
      }
    }

    tasks.push(task);
  }

  return tasks;
};

module.exports = publish;
