const f8Wait = require('./platforms/f8/wait');
const tolokaWait = require('./platforms/toloka/wait');

const start = async (blockData, input) => {
  input = input[Object.keys(input)[0]];

  if (blockData.platform === 'f8') {
    result = await f8Wait(blockData, input);
  } else if (blockData.platform === 'toloka') {
    result = await tolokaWait(blockData, input);
  } else {
    throw new Error(`Do-wait block: Unsupported platform!`);
  }
  return result;
};

module.exports = start;
