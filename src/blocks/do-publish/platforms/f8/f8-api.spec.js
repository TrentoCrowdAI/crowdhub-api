const f8 = require('./f8-api');
//const jobsDelegate = require(__base + 'delegates/jobs.delegate');

let example = __base + "../example/";
const rightJob = require(example + 'job-example-text-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('F8 tests', async () => {
    test('Empty', () => {
        expect(true).toBe(true);
    });
    /*
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
    });*/
});