const { getJob, pingJob, pauseJob, getCsvReport, getJobJudgments } = require(__base + 'platform-api/f8');

const admZip = require('adm-zip');
const neatCsv = require('neat-csv');
const sleep = require(__base + 'utils/utils').sleep;

const wait = async (blockData, input) => {
    let result;
    let jobId = input.id;
    let jEnded, crashed = true;
    while (crashed) {
        await sleep(1000 * 20);
        try {
            if (!jEnded)
                await jobFinished(jobId);
            jEnded = true;

            await sleep(2000); //in order to avoid downloading empty report

            result = await getCsvReport(jobId);

            crashed = false;
        }
        catch (err) {
            crashed = true;
        }
    }

    let csv = getCsvFromZip(result);
    result = await neatCsv(csv);

    return result;
};

const jobFinished = async (jobId) => {
    let job = await getJob(jobId);

    if (job.state !== "finished")
        throw Error("Job not finished!");
};

const getCsvFromZip = (buffer) => {
    var zip = new admZip(buffer);
    var zipEntries = zip.getEntries();
    return zip.readAsText(zipEntries[0]);
};

module.exports = wait;