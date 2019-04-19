const f8Publish = require('./platforms/f8/publish');
const tolokaPublish = require('./platforms/toloka/publish');

const start = async (blockData, input) => {
    let result;
    if(blockData.platform === 'f8')
        result = f8Publish(blockData, input);
    else if (blockData.platform === 'toloka')
        result = tolokaPublish(blockData, input);
    else
        throw new Error(`Do-publish block: Unsupported platform!`);
    
    return result;
};

module.exports = start;