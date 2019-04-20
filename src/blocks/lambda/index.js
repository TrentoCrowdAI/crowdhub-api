const lambdaExec = require('./execute-lambda');

const start = async (blockData, input) => {
    let result = lambdaExec(blockData, input);

    return result;
};

module.exports = start;