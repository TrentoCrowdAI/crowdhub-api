const sleep = require(__base + 'utils/utils').sleep;

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
            block.type = 'do-publish';

            const waitBlock = {
                id: `${block.id}_wait`,
                label: block.label,
                type: 'do-wait',
                parameters: {
                    platform: block.parameters.platform,
                    toCache: block.parameters.toCache,
                    sandbox: block.parameters.sandbox
                },
                children: block.children,
                parents: [block]
            };

            block.children = [waitBlock];
            blocks.push(waitBlock);
        }
    });
};

const getBlockInputs = (block, items) => {
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

module.exports = {
    connectBlocks,
    splitDoBlocks,
    getBlockInputs,
    getResult,
    getLastBlocks
};