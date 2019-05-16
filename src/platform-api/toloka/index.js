const fetch = require('node-fetch');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 3;

/**
 * Create a new project on Toloka
 * @param {{}} template_do
 * @param {{}} design
 */
const createProject = async (template_do, design, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + 'projects';

  let body = {
    public_name: template_do.name,
    public_description: template_do.description,
    public_instructions: template_do.instructions,
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
  let json = await res.json();
  if (res.status !== 201)
    throw new Error('Toloka Error: Not able to create a new Project!');


  return json;
}, { retries: RetryRetries });

/**
 * Create a new task pool on Toloka
 * @param {{}} blockData
 * @param {{}} project
 */
const createTaskPool = async (blockData, project, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + 'pools';

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
      real_tasks_count: blockData.taskPerPage,
      golden_tasks_count: 0,                  //TODO: change
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

  let json = await res.json();

  if (res.status !== 201)
    throw new Error('Toloka Error: Not able to create a new Pool!');

  return json;
}, { retries: RetryRetries });

/**
 * Create new tasks on Toloka
 * @param {[]} tasks
 */
const createTasks = async (tasks, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + 'tasks';

  let res = await fetch(url, {
    method: 'post',
    body: JSON.stringify(tasks),
    headers: {
      'Authorization': 'OAuth ' + config.toloka.accessToken,
      'Content-Type': 'application/JSON'
    }
  });
  let json = await res.json();

  if (res.status !== 201)
    throw new Error('Toloka Error: Not able to create new Tasks!');


  return json;
}, { retries: RetryRetries });


/**
 * Start a pool on Toloka
 * @param {[]} pool
 */
const startPool = async (pool, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + `pools/${pool.id}/open`;

  let res = await fetch(url, {
    method: 'post',
    headers: {
      'Authorization': 'OAuth ' + config.toloka.accessToken,
      'Content-Type': 'application/JSON'
    }
  });

  if (res.status !== 202)
    throw new Error('Toloka Error: Not able to start the Pool!');

  let json = await res.json();

  return json;
}, { retries: RetryRetries });

/**
 * Get a Pool on Toloka
 * @param {{}} pool
 */
const getPool = async (pool, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + 'pools/' + pool.id;

  let res = await fetch(url, {
    method: 'get',
    headers: {
      'Authorization': 'OAuth ' + config.toloka.accessToken
    }
  });

  if (res.status !== 200)
    throw new Error('Toloka Error: Not able to get the Pool!');

  let json = await res.json();
  return json;
}, { retries: RetryRetries });

/**
* Get the responses of a Pool on Toloka
* @param {{}} pool
*/
const getPoolResponses = async (pool, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + 'assignments?pool_id=' + pool.id;

  let res = await fetch(url, {
    method: 'get',
    headers: {
      'Authorization': 'OAuth ' + config.toloka.accessToken
    }
  });

  if (res.status !== 200)
    throw new Error('Toloka Error: Not able to get the responses of the Pool!');

  let json = await res.json();
  return json;
}, { retries: RetryRetries });

/**
* Close a Pool on Toloka
* @param {{}} pool
*/
const closePool = async (pool, sandbox) => retry(async () => {
  let baseUrl = sandbox ? config.toloka.sandboxEndpoint : config.toloka.baseEndpoint;
  let url = baseUrl + `pools/${pool.id}/close`;

  let res = await fetch(url, {
    method: 'post',
    headers: {
      'Authorization': 'OAuth ' + config.toloka.accessToken
    }
  });

  if (res.status !== 204)
    throw new Error('Toloka Error: Not able to close the Pool!');
}, { retries: RetryRetries });


/**
 * Convert the items to an array of Toloka tasks
 * @param {{}} pool
 * @param {String} items
 * @param {{}} design
 */
const itemsToTasks = async (pool, items, design) => {
  let tasks = [];

  for (let el of items) {
    let headers = Object.keys(el);

    let task = {
      pool_id: pool.id,
      input_values: {},
      overlap: 1
    };

    for (let key of headers) {
      if (Object.keys(design.input_spec).indexOf(key) != -1) {
        task.input_values[key] = el[key];
      } else if (key.endsWith('_gold')) {
        //gold item
        let pos = key.indexOf('_gold');

        let fieldName = key.substring(0, pos);
        if (Object.keys(design.output_spec).indexOf(fieldName) != -1) {
          if (task.known_solutions === undefined)
            task.known_solutions = [{ output_values: {}, correctness_weight: 1 }];

          task.known_solutions[0].output_values[fieldName] = el[key];
        }
      }
    }

    if (task.known_solutions !== undefined) {
      //fill with missing gold items in order to avoid errors
      for (let gold of Object.keys(design.output_spec)) {
        if (task.known_solutions[0].output_values[gold] === undefined)
          task.known_solutions[0].output_values[gold] = '';
      }
    }

    tasks.push(task);
  }

  return tasks;
};

const estimatePoolCost = (poolId, sandbox) => retry(async () => {
  let baseUrl = sandbox ? 'https://sandbox.toloka.yandex.ru/api/' : 'https://toloka.yandex.ru/api/';
  let url = baseUrl + `new/requester/pools/${poolId}/analytics?fields=expectedBudget`;

  let res = await fetch(url, {
    method: 'get',
    headers: {
      'Authorization': 'OAuth ' + config.toloka.accessToken
    }
  });

  if (res.status !== 200)
    throw new Error('Toloka Error: Not able to get the estimation of the Pool cost!');

  let json = await res.json();

  return json.expectedBudget.value;
}, { retries: RetryRetries });

module.exports = {
  createProject,
  createTaskPool,
  createTasks,
  itemsToTasks,
  startPool,
  getPool,
  getPoolResponses,
  closePool,
  estimatePoolCost
};
