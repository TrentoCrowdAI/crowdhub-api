const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());


const loadBlocks = () => {
    let blocks = {};

    dirs(__dirname).forEach(dir => {
        blocks[dir] = require('./' + dir);
    });
    
    return blocks;
};

module.exports = loadBlocks();