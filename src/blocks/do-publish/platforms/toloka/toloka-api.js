const fetch = require('node-fetch');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 3;

/**
 * Create a new project on Toloka
 * @param {{}} template_do
 * @param {{}} design
 */
const createProject = async (template_do, design) => retry(async () => {
  let url = config.toloka.baseEndpoint + 'projects';

  let body = {
    public_name: template_do.data.name,
    public_description: template_do.data.description,
    public_instructions: template_do.data.instructions,
    task_spec: {
      input_spec: design.input_spec,
      output_spec: design.output_spec,
      view_spec: {
        assets: {
          script_urls: [
            "https://code.jquery.com/jquery-3.3.1.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/texthighlighter/1.2.0/TextHighlighter.min.js",
            "$TOLOKA_ASSETS/js/toloka-handlebars-templates.js",
            "$TOLOKA_ASSETS/js/image-annotation.js"
          ]
        },
        markup: design.markup,
        script: design.javascript,
        styles: design.css,
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
  return json;
}, { retries: RetryRetries });

/**
 * Create a new task pool on Toloka
 * @param {{}} blockData
 * @param {{}} project
 */
const createTaskPool = async (blockData, project) => retry(async () => {
  let url = config.toloka.baseEndpoint + 'pools';

  let body = {
    project_id: project.id,
    private_name: 'pool',
    may_contain_adult_content: false,
    will_expire: '2022-03-11T12:00:00',         //TODO: change
    reward_per_assignment: blockData.reward,
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
  return json;
}, { retries: RetryRetries });

/**
 * Create new tasks on Toloka
 * @param {[]} tasks
 */
const createTasks = async (tasks) => retry(async () => {
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
  return json;
}, { retries: RetryRetries });

module.exports = { createProject, createTaskPool, createTasks };
