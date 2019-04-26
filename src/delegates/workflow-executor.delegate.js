const blockDefinitions = require(__base + 'blocks');
const itemsDelegate = require('./items.delegate');

let blockPromises = [];
let items = [];

const start = async (workflow) => {
    let blocks = workflow.data.graph.nodes;
    let links = workflow.data.graph.links;

    connectBlocks(blocks, links);

    splitDoBlocks(blocks);

    items = await itemsDelegate.getAll(workflow.id_project);

    startBlocksWithoutParent(blocks);

    let results = await Promise.all(blockPromises);
    console.log(blocks);
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
        if (block.nodeType === 'do') {
            block.nodeType = 'doPublish';

            const waitBlock = {
                id: `${block.id}_wait`,
                nodeType: 'doWait',
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
            blockPromises.push(startBlock(block));
        }
    });
};

const startBlock = async (block) => {
    let inputs = [];
    for (let parent of block.parents) {
        if (!parent.executed) {
            return;
        }

        inputs.push(parent.result);
    }

    if (inputs.length === 0)
        inputs = items;

    //debug purpose
    if(block.nodeType === 'doWait')
        return inputs;

    block.result = await blockDefinitions[block.nodeType](block.parameters, inputs);

    block.executed = true;

    for (let child of block.children) {
        blockPromises.push(startBlock(child));
    }
};

module.exports = start;