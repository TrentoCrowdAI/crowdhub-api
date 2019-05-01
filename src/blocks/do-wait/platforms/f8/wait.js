const { pingJob, pauseJob, getCsvReport, getJobJudgments } = require('./f8-api');

const admZip = require('adm-zip');
const neatCsv = require('neat-csv');
const sleep = require(__base + 'utils/utils').sleep;

const wait = async (blockData, input) => {
    let result;
    let jobId = input.id;
    let jEnded, jPaused, crashed = true;
    while (crashed) {
        await sleep(1000 * 20);
        try {
            if (!jEnded)
                await jobFinished(jobId);
            jEnded = true;

            if (!jPaused)
                await pauseJob(jobId);
            jPaused = true;

            await sleep(5000); //in order to avoid downloading empty report

            result = await getCsvReport(jobId);

            crashed = false;
        }
        catch (err) {
            crashed = true;
        }
    }

    let csv = getCsvFromZip(result);
    result = await neatCsv(csv);
console.log(csv, result);
    return result;
};

const jobFinished = async (jobId) => {
    let judg = await getJobJudgments(jobId);

    let num_answer = 1; //TODO: change
    if (Object.keys(judg) < num_answer)
        throw Error("Job not finished!");
};

const getCsvFromZip = (buffer) => {
    var zip = new admZip(buffer);
    var zipEntries = zip.getEntries();
    return zip.readAsText(zipEntries[0]);
};

module.exports = wait;