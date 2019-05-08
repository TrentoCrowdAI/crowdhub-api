const blockDefinitions = require(__base + 'blocks');
const itemsDelegate = require('./items.delegate');
const runsDelegate = require('./runs.delegate');
const cacheDelegate = require('./cache.delegate');


const sleep = require(__base + 'utils/utils').sleep;

let items = [];
let run;

const start = async (workflow) => {
    let blocks = workflow.data.graph.nodes;
    let links = workflow.data.graph.links;

    connectBlocks(blocks, links);

    splitDoBlocks(blocks);

    await createNewRun(workflow);

    items = await itemsDelegate.getAll(workflow.id_project);
    items = items.map(i => i.data);

    startBlocksWithoutParent(blocks);

    //let result = await getResult(blocks);

    return run.id;
};

const createNewRun = async (workflow) => {
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

const connectBlocks = (blocks, links) => {
    blocks.forEach(block => {
        //map INPUT blocks
        block.parents = block.ports[0].links.map(id => {
            let link = links.find((link) => link.id === id);
            return blocks.find((elem) => elem.id === link.source);
        });

        //map OUTPUT blocks
        block.children = block.ports[1].links.map(id => {
            let link = links.find((link) => link.id === id);
            return blocks.find((elem) => elem.id === link.target);
        });
    });
};

const splitDoBlocks = (blocks) => {
    blocks.forEach(block => {
        if (block.type === 'do') {
            block.type = 'doPublish';

            const waitBlock = {
                id: `${block.id}_wait`,
                label: block.label,
                type: 'doWait',
                parameters: {
                    platform: block.parameters.platform,
                    toCache: block.parameters.toCache
                },
                children: block.children,
                parents: [block]
            };

            block.children = [waitBlock];
            blocks.push(waitBlock);
        }
    });
};

const startBlocksWithoutParent = (blocks) => {
    blocks.forEach(block => {
        if (block.parents.length == 0) {
            //start block without awaiting
            block.promise = startBlock(block);
        }
    });
};

const startBlock = async (block) => {
    let inputs = getBlockInputs(block);

    await updateBlockState(block.id, 'running');

    let cachedValue = await getLastCachedResult(block);

    if (block.parameters.toCache && cachedValue !== undefined) { // check if a cached value is available
        block.result = cachedValue;
    }
    else {
        block.result = await blockDefinitions[block.type](block.parameters, inputs);
    }

    block.executed = true;
    //cache result
    await cacheBlockResult(block.id, block.result);

    await updateBlockState(block.id, 'finished');

    for (let child of block.children) {
        child.promise = startBlock(child);
    }
};

const getLastCachedResult = async (block) => {
    let allRuns = await runsDelegate.getAll(run.id_workflow);

    //sort runs to have the last created as first
    allRuns = allRuns.sort((a, b) => b.id - a.id);

    for (let r of allRuns) {
        let runBlocks = Object.keys(r.data);
        if (runBlocks.indexOf(block.id) != -1 && r.data[block.id].state === 'finished') {
            let cacheId = r.data[block.id].id_cache;
            return await cacheDelegate.get(cacheId);
        }
    }
};

const getBlockInputs = (block) => {
    let inputs = {};
    for (let parent of block.parents) {
        if (!parent.executed) {
            return;
        }

        let myInput = parent.result;
        if (parent.children.length > 1) { //take only my block's input
            let myIndex = parent.children.indexOf(block);
            myInput = parent.result[myIndex];
        }

        inputs[parent.label] = myInput;
    }

    if (Object.keys(inputs).length === 0) //first block
        inputs['default'] = items;

    return inputs;
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

const getResult = async (blocks) => {
    let results = [];
    for (let block of blocks) {
        while (block.promise === undefined)
            sleep(100);

        await block.promise;
        if (block.children.length === 0)
            results.push(block.result);
    }

    return results;
};

const getLastBlocks = (workflow) => {
    let blocks = workflow.data.graph.nodes;
    let links = workflow.data.graph.links;

    connectBlocks(blocks, links);
    splitDoBlocks(blocks);

    let nodes = [];
    blocks.forEach(block => {
        if (block.children.length == 0) {
            nodes.push(block);
        }
    });

    return nodes;
};

module.exports = { start, getLastBlocks };