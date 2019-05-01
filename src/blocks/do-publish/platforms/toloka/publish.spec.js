const doPublish = require('./publish');

let example = __base + "../example/";
const exampleTextHighlighting = require(example + 'job-example-text-highlighting.json');
const exampleImageClassification = require(example + 'job-example-image-classification.json');
const exampleImageHighlighting = require(example + 'job-example-image-highlighting.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('Toloka tests', async () => {
  beforeAll(async () => {
  });

  test('Toloka publish test [text-highlighting]', async () => {
    let res = await doPublish(exampleTextHighlighting.blockData, exampleTextHighlighting.input);
    expect(res).toBeDefined();
    expect(res.id).toBeDefined();
    expect(typeof res.task_spec.view_spec.markup).toBe("string");
    expect(typeof res.task_spec.view_spec.script).toBe("string");
    expect(typeof res.task_spec.view_spec.styles).toBe("string");

    expect(res.taskPool.id).toBeDefined();
    expect(res.tasks).toBeDefined();

    expect(res.start.id).toBeDefined();
  });

  test('Toloka publish test [image-classification]', async () => {
    let res = await doPublish(exampleImageClassification.blockData, exampleImageClassification.input);
    expect(res).toBeDefined();
    expect(res.id).toBeDefined();
    expect(typeof res.task_spec.view_spec.markup).toBe("string");
    expect(typeof res.task_spec.view_spec.script).toBe("string");
    expect(typeof res.task_spec.view_spec.styles).toBe("string");

    expect(res.taskPool.id).toBeDefined();
    expect(res.tasks).toBeDefined();

    expect(res.start.id).toBeDefined();
  });

  test('Toloka publish test [image-highlighting]', async () => {
    let res = await doPublish(exampleImageHighlighting.blockData, exampleImageHighlighting.input);
    expect(res).toBeDefined();
    expect(res.id).toBeDefined();
    expect(typeof res.task_spec.view_spec.markup).toBe("string");
    expect(typeof res.task_spec.view_spec.script).toBe("string");
    expect(typeof res.task_spec.view_spec.styles).toBe("string");

    expect(res.taskPool.id).toBeDefined();
    expect(res.tasks).toBeDefined();

    expect(res.start.id).toBeDefined();
  });

  afterAll(async () => {
  });
});
