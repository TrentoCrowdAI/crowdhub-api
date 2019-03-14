const fetch = require('node-fetch');
const neatCsv = require('neat-csv');

const config = require(__base + 'config/index');

const publish = async (job) => {
    let inOutParams = await markupToInOutParams(job);

    job = await createProject(job, inOutParams);

    job = await createTaskPool(job);

    let tasks = await csvToTasks(job, job.data.items_csv, inOutParams);
    let gold_tasks = await csvToTasks(job, job.data.items_gold_csv, inOutParams);

    job = await createTasks(job, tasks, inOutParams);
    job = await createTasks(job, gold_tasks, inOutParams);

    return job;
};

const createProject = async (job, inOutParams) => {
    let url = config.toloka.baseEndpoint + 'projects';

    let body = {
        public_name: job.data.name,
        public_description: job.data.description,
        public_instructions: job.data.instructions,
        task_spec: {
            input_spec: inOutParams.input_spec,
            output_spec: inOutParams.output_spec,
            view_spec: {
                markup: job.data.design.markup,
                script: job.data.design.javascript,
                style: job.data.design.css,
                settings: {
                    showSkip: true,
                    showTimer: true,
                    showTitle: true,
                    showSubmit: true,
                    showFullscreen: true,
                    showInstructions: true
                }
            }
        },
        assignments_issuing_type: "AUTOMATED"

    };

    let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken,
            'Content-Type': 'application/JSON'
        }
    });

    if (res.status !== 201)
        throw new Error('Toloka Error: Not able to create a new Project!');

    let json = await res.json();

    if (job.data.platform === undefined)
        job.data.platform = {};

    if (job.data.platform.toloka === undefined)
        job.data.platform.toloka = {};

    job.data.platform.toloka.project = json;

    return job;
};

const createTaskPool = async (job) => {
    let url = config.toloka.baseEndpoint + 'pools';

    let body = {
        project_id: job.data.platform.toloka.project.id,
        private_name: 'pool',
        may_contain_adult_content: false,
        will_expire: '2022-03-11T12:00:00',         //TODO: change
        reward_per_assignment: job.data.reward,
        assignment_max_duration_seconds: 60,
        defaults: {
            default_overlap_for_new_task_suites: 1
        }
    };

    let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken,
            'Content-Type': 'application/JSON'
        }
    });

    if (res.status !== 201)
        throw new Error('Toloka Error: Not able to create a new Pool!');

    let json = await res.json();

    if (job.data.platform === undefined)
        job.data.platform = {};

    if (job.data.platform.toloka === undefined)
        job.data.platform.toloka = {};

    job.data.platform.toloka.pool = json;

    return job;

};

const markupToInOutParams = async (job) => {
    let regInput = /{{([^\ ]+)}}/igm;
    let regOutput = /{field.*name=\"([^\ ]+)\".*}}/igm;

    let input = (job.data.design.markup.match(regInput) || []).map(e => e.replace(regInput, '$1'));
    let output = [...new Set((job.data.design.markup.match(regOutput) || []).map(e => e.replace(regOutput, '$1')))];

    let inOutSpec = { input_spec: {}, output_spec: {} };

    for (let inp of input) {
        inOutSpec.input_spec[inp] = {
            type: 'string'
        };
    }

    for (let out of output) {
        inOutSpec.output_spec[out] = {
            type: 'string'
        };
    }

    return inOutSpec;
};

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
            }
            else if (key.endsWith('_gold')) {
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

const createTasks = async (job, tasks) => {
    let url = config.toloka.baseEndpoint + 'tasks';
    
    let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(tasks),
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken,
            'Content-Type': 'application/JSON'
        }
    });

    if (res.status !== 201)
        throw new Error('Toloka Error: Not able to create new Tasks!');

    let json = await res.json();

    return job;
};

module.exports = {
    publish
};