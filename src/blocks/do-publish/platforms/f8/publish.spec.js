const doPublish = require('./publish');

let example = __base + "../example/";
const exampleTextHighlighting = require(example + 'job-example-text-highlighting.json');
const exampleImageClassification = require(example + 'job-example-image-classification.json');
const exampleImageHighlighting = require(example + 'job-example-image-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('F8 tests', async () => {
    beforeAll(async () => {
    });

    test('F8 publish test [text-highlighting]', async () => {
        let res = await doPublish(exampleTextHighlighting.blockData, exampleTextHighlighting.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    test('F8 publish test [image-classification]', async () => {
        let res = await doPublish(exampleImageClassification.blockData, exampleImageClassification.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    test('F8 publish test [image-highlighting]', async () => {
        let res = await doPublish(exampleImageHighlighting.blockData, exampleImageHighlighting.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    afterAll(async () => {
    });
});