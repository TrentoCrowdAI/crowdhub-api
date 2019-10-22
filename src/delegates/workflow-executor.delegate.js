const blockDefinitions = require(__base + 'blocks');
const itemsDelegate = require('./items.delegate');
const runsDelegate = require('./runs.delegate');
const cacheDelegate = require('./cache.delegate');

const {
  connectBlocks,
  splitDoBlocks,
  getBlockInputs,
  getResult,
  getLastBlocks
} = require('./workflow-graph.delegate');

let items = [];
let run;

const start = async workflow => {
  let blocks = workflow.data.graph.nodes;
  let links = workflow.data.graph.links;

  connectBlocks(blocks, links);

  splitDoBlocks(blocks);

  await createNewRun(workflow);

  items = await itemsDelegate.getAll(workflow.id_project);
  items = items.map(i => i.data);

  startBlocksWithoutParent(blocks, workflow);

  //let result = await getResult(blocks);

  return run.id;
};

const createNewRun = async workflow => {
  let tmprun = {
    id_workflow: workflow.id,
    data: {}
  };
  let blocks = workflow.data.graph.nodes;

  blocks.forEach(block => {
    tmprun.data[block.id] = {
      state: 'not started'
    };
  });

  run = await runsDelegate.create(tmprun);
};

const startBlocksWithoutParent = (blocks, workflow) => {
  blocks.forEach(block => {
    if (block.parents.length == 0) {
      //start block without awaiting
      block.promise = startBlock(block, workflow);
    }
  });
};

const startBlock = async (block, workflow) => {
  let inputs = getBlockInputs(block, items);

  await updateBlockState(block.id, 'running');

  let cachedValue = await getLastCachedResult(block);

  if (block.parameters.toCache && cachedValue !== undefined) {
    // check if a cached value is available
    block.result = cachedValue.data.result;
  } else {
    block.result = await blockDefinitions[block.type](block.parameters, inputs);
  }

  console.info('BLOCK', block);

  // if experimental groups are enable, add the experimental group as a column.
  if (block.type === 'do-wait' && block.parameters.blockingContextId) {
    console.info('Add experimental group as column');

    let blockingContext = workflow.data.graph.blockingContexts.find(
      ctx => ctx.id === block.parameters.blockingContextId
    );

    for (let item of block.result) {
      item.experimental_group = blockingContext.name;
    }

    console.info('Updated items', block.result);
  }

  block.executed = true;
  //cache result
  await cacheBlockResult(block.id, block.result);

  await updateBlockState(block.id, 'finished');

  for (let child of block.children) {
    // TODO: children should run in parallel.
    child.promise = startBlock(child, workflow);
  }
};

const getLastCachedResult = async block => {
  let allRuns = await runsDelegate.getAll(run.id_workflow);

  //sort runs to have the last created as first
  allRuns = allRuns.sort((a, b) => b.id - a.id);

  for (let r of allRuns) {
    let runBlocks = Object.keys(r.data);
    if (
      runBlocks.indexOf(block.id) != -1 &&
      r.data[block.id].state === 'finished'
    ) {
      let cacheId = r.data[block.id].id_cache;
      return await cacheDelegate.get(cacheId);
    }
  }
};

const updateBlockState = async (blockId, state) => {
  run.data[blockId].state = state;

  await runsDelegate.update(run, run.id);
};

const cacheBlockResult = async (blockId, result) => {
  let cache = {
    id_run: run.id,
    data: {
      result: result
    }
  };

  cache = await cacheDelegate.create(cache);

  run.data[blockId].id_cache = cache.id;

  await runsDelegate.update(run, run.id);
};

module.exports = { start };
