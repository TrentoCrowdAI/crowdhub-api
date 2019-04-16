const fetch = require('node-fetch');
const neatCsv = require('neat-csv');

const config = require(__base + 'config/index');

/**
 * Create a new project on Toloka
 * @param {{}} job
 * @param {{}} inOutParams
 */
const createProject = async (job, param) => {
  let url = config.toloka.baseEndpoint + 'projects';

  let body = {
    public_name: job.data.name,
    public_description: job.data.description,
    public_instructions: job.data.instructions,
    task_spec: {
      input_spec: param.input_spec,
      output_spec: param.output_spec,
      view_spec: {
        assets: {
          script_urls: [
            "https://code.jquery.com/jquery-3.3.1.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/texthighlighter/1.2.0/TextHighlighter.min.js",
            "$TOLOKA_ASSETS/js/toloka-handlebars-templates.js",
            "$TOLOKA_ASSETS/js/image-annotation.js"
          ]
        },
        markup: param.markup,
        script: param.javascript,
        styles: param.css,
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

/**
 * Create a new task pool on Toloka
 * @param {{}} job
 */
const createTaskPool = async (job) => {
  let url = config.toloka.baseEndpoint + 'pools';

  let body = {
    project_id: job.data.platform.toloka.project.id,
    private_name: 'pool',
    may_contain_adult_content: false,
    will_expire: '2022-03-11T12:00:00',         //TODO: change
    reward_per_assignment: job.data.reward,
    assignment_max_duration_seconds: 60 * 10,
    defaults: {
      default_overlap_for_new_task_suites: 1
    },
    mixer_config: {
      real_tasks_count: 1,                    //TODO: change
      golden_tasks_count: 1,
      training_tasks_count: 0
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

/**
 * Create new tasks on Toloka
 * @param {{}} job
 * @param {[]} tasks
 */
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

module.exports = {createProject, createTaskPool, createTasks};
