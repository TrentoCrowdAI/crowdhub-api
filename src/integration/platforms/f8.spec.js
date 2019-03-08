const f8 = require('./f8');
const jobsDelegate = require(__base + 'integration/delegates/jobs.delegate');

const rightJob = require(__base + 'example/job-example.json');

//set jest timeout to 10 seconds
jest.setTimeout(10000);

describe('F8 tests', async () => {
    let job;

    beforeAll(async () => {
        job = await jobsDelegate.createJob(rightJob);
    });

    test('F8 publish test', async () => {
        let res = await f8.publish(job);

        expect(res.data.platform.f8).toBeDefined();
        expect(res.data.platform.f8.id).toBeDefined();
    });

    afterAll(async () => {
        await jobsDelegate.deleteJob(job.id);
    });
});