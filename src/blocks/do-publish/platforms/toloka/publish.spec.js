const doPublish = require('./publish');
const templateDoDelegate = require(__base + 'delegates/template-do.delegate');

let example = __base + "../example/";
const exampleData = require(example + 'job-example-text-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('Toloka tests', async () => {
  let templateDo;

  beforeAll(async () => {
  });

  test('Toloka publish test', async () => {
      //create template-do
      templateDo = await templateDoDelegate.create(exampleData.template_do);

      exampleData.blockData.id_template_do = templateDo.id;
      let res = await doPublish(exampleData.blockData, exampleData.input);
      expect(res).toBeDefined();
      expect(res.id).toBeDefined();
      expect(typeof res.task_spec.view_spec.markup).toBe("string");
      expect(typeof res.task_spec.view_spec.script).toBe("string");
      expect(typeof res.task_spec.view_spec.styles).toBe("string");

      expect(res.taskPool.id).toBeDefined();
      expect(res.tasks).toBeDefined();
      
  });

  afterAll(async () => {
      await templateDoDelegate.deleteTemplateDo(templateDo.id);
  });
});
