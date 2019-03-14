const toloka = require('./toloka');
const jobsDelegate = require(__base + 'integration/delegates/jobs.delegate');

const rightJob = require(__base + 'example/job-example-toloka.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('Toloka tests', async () => {
    let job;

    beforeAll(async () => {
        job = await jobsDelegate.createJob(rightJob);
    });

    test('Toloka publish test', async () => {
        let res = await toloka.publish(job);

        expect(res.data.platform.toloka).toBeDefined();
    });

    afterAll(async () => {
        await jobsDelegate.deleteJob(job.id);
    });
});