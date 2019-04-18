const doPublish = require('./publish');
const templateDoDelegate = require(__base + 'delegates/template-do.delegate');

let example = __base + "../example/";
const exampleData = require(example + 'job-example-text-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('F8 tests', async () => {
    let templateDo;

    beforeAll(async () => {
    });

    test('F8 publish test', async () => {
        //create template-do
        templateDo = await templateDoDelegate.create(exampleData.template_do);

        exampleData.blockData.id_template_do = templateDo.id;
        let res = await doPublish(exampleData.blockData, exampleData.input);
        expect(res).toBeDefined();
        expect(res.id).toBeDefined();
        expect(typeof res.cml).toBe("string");
        expect(typeof res.js).toBe("string");
        expect(typeof res.css).toBe("string");
    });

    afterAll(async () => {
        await templateDoDelegate.deleteTemplateDo(templateDo.id);
    });
});