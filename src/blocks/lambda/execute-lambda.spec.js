const execute = require('./execute-lambda');

describe('Lambda-block execute', () => {
    test('Test correct code execution', async () => {
        let code = `return input.length;`;

        let blockData = {
            code: code
        }
        let input = [];

        let res = execute(blockData, input);
        expect(res).toBe(input.length);
    });

    test('Test correct read of the input array', async () => {
        let code = `return input;`;

        let blockData = {
            code: code
        }
        let input = [{ a: 1, b: 'test' }];

        let res = execute(blockData, input);
        expect(res).toEqual(input);
    });

    test('Test complex items return', async () => {
        let code = `return [{ a: 1, b: 2 }];`;

        let blockData = {
            code: code
        }
        let input = [];

        let result = [{ a: 1, b: 2 }];
        let res = execute(blockData, input);
        expect(res).toEqual(result);
    });

    test('Test wrong syntax code', async () => {
        let code = `return a';`;

        let blockData = {
            code: code
        }
        let input = [];

        expect(() => execute(blockData, input)).toThrow();
    });

    test('Test require functionality should not be available', async () => {
        let code = `require('fs');`;

        let blockData = {
            code: code
        }
        let input = [];

        expect(() => execute(blockData, input)).toThrow();
    });
});