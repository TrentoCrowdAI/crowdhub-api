const { createNewJob, addCsvItems, updateJobMarkup, updateJobJS, updateJobCSS, updateJobSpec, convertGoldQuestions } = require('./toloka-api');
const renderDesign = require('./render');
const sleep = require(__base + 'utils/utils').sleep;

/**
 * Publish the job parameter on the F8 platform as a new job.
 * @param {{}} job 
 */
const publish = async (job) => {
    const timeSleep = 200;
    job = await createNewJob(job);

    await sleep(timeSleep);

    //add items
    job = await addCsvItems(job, job.data.items_csv);

    await sleep(timeSleep);

    //add gold items
    job = await addCsvItems(job, job.data.items_gold_csv);
    await sleep(timeSleep);

    //recognise gold items
    await convertGoldQuestions(job);
    await sleep(timeSleep);

    //render the design of the job
    let design = renderDesign(job);

    //set the design of the job
    job = await updateJobMarkup(job, design);
    await sleep(timeSleep);
    job = await updateJobJS(job, design);
    await sleep(timeSleep);
    job = await updateJobCSS(job, design);
    await sleep(timeSleep);

    //set the reward info of the job
    job = await updateJobSpec(job);

    return job;
};

module.exports = publish;