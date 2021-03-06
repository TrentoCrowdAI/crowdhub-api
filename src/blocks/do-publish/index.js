const f8Publish = require('./platforms/f8/publish');
const tolokaPublish = require('./platforms/toloka/publish');

const start = async (blockData, input) => {
  input = input[Object.keys(input)[0]];

  let result;
  if (blockData.platform === 'f8') {
    result = await f8Publish(blockData, input);
  } else if (blockData.platform === 'toloka') {
    result = await tolokaPublish(blockData, input);
  } else {
    throw new Error(`Do-publish block: Unsupported platform!`);
  }
  return result;
};

module.exports = start;
