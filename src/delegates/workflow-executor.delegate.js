const blockDefinitions = require(__base + 'blocks');
const itemsDelegate = require('./items.delegate');
const sleep = require(__base + 'utils/utils').sleep;

let items = [];

const start = async (workflow) => {
    let blocks = workflow.data.graph.nodes;
    let links = workflow.data.graph.links;

    connectBlocks(blocks, links);

    splitDoBlocks(blocks);

    items = await itemsDelegate.getAll(workflow.id_project);
    items = items.map(i => i.data);

    startBlocksWithoutParent(blocks);

    let result = await getResult(blocks);
    
    return result;
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
                type: 'doWait',
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

    block.result = await blockDefinitions[block.nodeType](block.parameters, inputs);

    block.executed = true;

    for (let child of block.children) {
        child.promise = startBlock(child);
    }
};

const getBlockInputs = (block) => {
    let inputs = [];
    for (let parent of block.parents) {
        if (!parent.executed) {
            return;
        }

        let myInput = parent.result;
        if (parent.children.length > 1) { //take only my block's input
            let myIndex = parent.children.indexOf(block);
            myInput = parent.result[myIndex];
        }

        inputs.push(myInput);
    }

    if (inputs.length === 1)
        inputs = inputs[0];

    if (inputs.length === 0) //first block
        inputs = items;
    
    return inputs;
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

module.exports = start;