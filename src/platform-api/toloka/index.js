// This module needs work.

const fetch = require('node-fetch');
const retry = require('async-retry');

const config = require(__base + 'config/index');

const RetryRetries = 3;

/**
 * Create a new project on Toloka
 * @param {{}} template_do
 * @param {{}} design
 */
const createProject = async (template_do, design, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
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
                'https://code.jquery.com/jquery-3.3.1.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/texthighlighter/1.2.0/TextHighlighter.min.js',
                '$TOLOKA_ASSETS/js/toloka-handlebars-templates.js',
                '$TOLOKA_ASSETS/js/image-annotation.js'
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
        assignments_issuing_type: 'AUTOMATED'
      };

      let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken,
          'Content-Type': 'application/JSON'
        }
      });
      let json = await res.json();

      if (res.status !== 201) {
        console.error(json);
        throw new Error('Toloka Error: Not able to create a new Project!');
      }

      return json;
    },
    { retries: RetryRetries }
  );

/**
 * Create a new task pool on Toloka
 * @param {{}} blockData
 * @param {{}} project
 */
const createTaskPool = async (blockData, project, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
      let url = baseUrl + 'pools';

      let body = {
        project_id: project.id,
        private_name: 'pool',
        may_contain_adult_content: false,
        will_expire: '2022-03-11T12:00:00', //TODO: change
        reward_per_assignment: parseInt(blockData.reward) / 100,
        assignment_max_duration_seconds: 60 * 10, // TODO: change this
        allow_defaults: true,
        defaults: {
          default_overlap_for_new_task_suites: blockData.numVotes
        },
        mixer_config: {
          real_tasks_count: blockData.taskPerPage,
          golden_tasks_count: 0, //TODO: change
          training_tasks_count: 0
        }
      };

      let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken,
          'Content-Type': 'application/JSON'
        }
      });

      let json = await res.json();

      if (res.status !== 201) {
        console.error(json);
        throw new Error('Toloka Error: Not able to create a new Pool!');
      }

      return json;
    },
    { retries: RetryRetries }
  );

/**
 * Create new tasks on Toloka
 * @param {[]} tasks
 */
const createTasks = async (tasks, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
      let url = baseUrl + 'tasks';

      let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(tasks),
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken,
          'Content-Type': 'application/JSON'
        }
      });
      let json = await res.json();

      if (res.status !== 201) {
        console.error(json);
        throw new Error('Toloka Error: Not able to create new Tasks!');
      }

      return json;
    },
    { retries: RetryRetries }
  );

/**
 * Start a pool on Toloka
 * @param {[]} pool
 */
const startPool = async (pool, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
      let url = baseUrl + `pools/${pool.id}/open`;

      let res = await fetch(url, {
        method: 'post',
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken,
          'Content-Type': 'application/JSON'
        }
      });
      let json = await res.json();

      if (res.status !== 202) {
        console.error(json);
        throw new Error('Toloka Error: Not able to start the Pool!');
      }
      return json;
    },
    { retries: RetryRetries }
  );

/**
 * Get a Pool on Toloka
 * @param {{}} pool
 */
const getPool = async (pool, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
      let url = baseUrl + 'pools/' + pool.id;

      let res = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken
        }
      });
      let json = await res.json();

      if (res.status !== 200) {
        console.error(json);
        throw new Error('Toloka Error: Not able to get the Pool!');
      }
      return json;
    },
    { retries: RetryRetries }
  );

/**
 * Get the responses of a Pool on Toloka
 * @param {{}} pool
 */
const getPoolResponses = async (pool, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
      let url = baseUrl + 'assignments?pool_id=' + pool.id;

      let res = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken
        }
      });
      let json = await res.json();

      if (res.status !== 200) {
        console.error(json);
        throw new Error(
          'Toloka Error: Not able to get the responses of the Pool!'
        );
      }
      return json;
    },
    { retries: RetryRetries }
  );

/**
 * Close a Pool on Toloka
 * @param {{}} pool
 */
const closePool = async (pool, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? config.toloka.sandboxEndpoint
        : config.toloka.baseEndpoint;
      let url = baseUrl + `pools/${pool.id}/close`;

      let res = await fetch(url, {
        method: 'post',
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken
        }
      });
      let json = await res.json();

      if (res.status !== 204) {
        console.error(json);
        throw new Error('Toloka Error: Not able to close the Pool!');
      }
    },
    { retries: RetryRetries }
  );

/**
 * Convert the items to an array of Toloka tasks
 * @param {{}} pool
 * @param {String} items
 * @param {{}} design
 */
const itemsToTasks = async (pool, items, design) => {
  // This function supports main and control items. Train pool tasks are not supported yet.
  let tasks = [];
  let designInputColumns = Object.keys(design.input_spec);
  let designOutputColumns = Object.keys(design.output_spec);
  let itemColumns = Object.keys(items[0]);

  for (let row of items) {
    let task = {
      pool_id: pool.id,
      input_values: {},
      overlap: pool.defaults.default_overlap_for_new_task_suites
    };

    for (let col of designInputColumns) {
      task.input_values[col] = row[col];
    }

    if (row.is_main === 1) {
      continue;
    }
    // let's setup the control tasks.
    task.known_solutions = [];

    for (let col of designOutputColumns) {
      let ks = { output_values: {}, correctness_weight: 1 };

      if (!itemColumns.includes(col)) {
        continue;
      }
      ks.output_values[col] = row[`${col}_gold`];
      task.known_solutions.push(ks);
    }
    tasks.push(task);
  }
  return tasks;
};

const estimatePoolCost = (poolId, sandbox) =>
  retry(
    async () => {
      let baseUrl = sandbox
        ? 'https://sandbox.toloka.yandex.ru/api/'
        : 'https://toloka.yandex.ru/api/';
      let url =
        baseUrl +
        `new/requester/pools/${poolId}/analytics?fields=expectedBudget`;

      let res = await fetch(url, {
        method: 'get',
        headers: {
          Authorization: 'OAuth ' + config.toloka.accessToken
        }
      });
      let json = await res.json();

      if (res.status !== 200) {
        console.error(json);
        throw new Error(
          'Toloka Error: Not able to get the estimation of the Pool cost!'
        );
      }

      return json.expectedBudget.value;
    },
    { retries: RetryRetries }
  );

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
