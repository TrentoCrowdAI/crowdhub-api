const doPublish = require('./publish');
const templateDoDelegate = require(__base + 'delegates/template-do.delegate');

let example = __base + "../example/";
const exampleTextHighlighting = require(example + 'job-example-text-highlighting.json');
const exampleImageClassification = require(example + 'job-example-image-classification.json');
const exampleImageHighlighting = require(example + 'job-example-image-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('F8 tests', async () => {
    let templateDoIds = [];

    beforeAll(async () => {
    });

    test('F8 publish test [text-highlighting]', async () => {
        //create template-do
        let templateDo = await templateDoDelegate.create(exampleTextHighlighting.template_do);
        templateDoIds.push(templateDo.id);

        exampleTextHighlighting.blockData.id_template_do = templateDo.id;
        let res = await doPublish(exampleTextHighlighting.blockData, exampleTextHighlighting.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    test('F8 publish test [image-classification]', async () => {
        //create template-do
        let templateDo = await templateDoDelegate.create(exampleImageClassification.template_do);
        templateDoIds.push(templateDo.id);

        exampleImageClassification.blockData.id_template_do = templateDo.id;
        let res = await doPublish(exampleImageClassification.blockData, exampleImageClassification.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    test('F8 publish test [image-highlighting]', async () => {
        //create template-do
        let templateDo = await templateDoDelegate.create(exampleImageHighlighting.template_do);
        templateDoIds.push(templateDo.id);

        exampleImageHighlighting.blockData.id_template_do = templateDo.id;
        let res = await doPublish(exampleImageHighlighting.blockData, exampleImageHighlighting.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    afterAll(async () => {
        for (let id of templateDoIds)
          await templateDoDelegate.deleteTemplateDo(id);
    });
});