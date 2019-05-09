const { createNewJob, addItems, updateJobMarkup, updateJobJS, updateJobCSS, updateJobSpec, convertGoldQuestions, startJob } = require('./f8-api');
const renderDesign = require('./render');

const sleep = require(__base + 'utils/utils').sleep;

/**
 * Publish the job parameter on the F8 platform as a new job.
 * @param {{}} blockData The data of the block of the workflow 
 * @param {[]} input The input items to publish
 */
const publish = async (blockData, input) => {
    const timeSleep = 200;

    let job = await createNewJob(blockData);

    await sleep(timeSleep);

    //add all items (even gold)
    job = await addItems(job, itemsToJsonLines(input));

    await sleep(timeSleep);

    //recognise gold items
    await convertGoldQuestions(job);
    await sleep(timeSleep);

    //render the design of the job
    let design = renderDesign(blockData.jobDesign.blocks);
    //set the design of the job
    job = await updateJobMarkup(job, design);
    await sleep(timeSleep);
    job = await updateJobJS(job, design);
    await sleep(timeSleep);
    job = await updateJobCSS(job, design);
    await sleep(timeSleep);

    //set the reward info of the job
    job = await updateJobSpec(job, blockData);
    await sleep(timeSleep);

    job = await startJob(job, blockData.sandbox);

    return job;
};

const itemsToJsonLines = (items) => {
    let result = "";

    for(let item of items){
        result += JSON.stringify(item) + "\r\n";
    }

    return result;
};

module.exports = publish;