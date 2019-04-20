const { VM, VMScript } = require('vm2');

const start = (blockData, input) => {
    const vm = new VM({
        sandbox: {
            input: input
        }
    });
    const code = encapsulateCode(blockData.code);
    const script = new VMScript(code);

    return vm.run(script);
};

const encapsulateCode = (code) => {
    return `
    let lambda = function () {
        ${code}
    }; 
    lambda();
    `;
};

module.exports = start;