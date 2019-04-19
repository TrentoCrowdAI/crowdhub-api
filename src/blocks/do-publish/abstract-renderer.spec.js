const abstractRenderer = require('./abstract-renderer');
let example = __base + "../example/";

describe('Abstract-renderer tests', async () => {
    const blocks = require(example + 'markup-design.json');

    const renderers = {
        input_dynamic_text: { renderBody: jest.fn(), renderFooter: jest.fn() },
        input_static_text: { renderBody: jest.fn(), renderFooter: jest.fn() },
        input_dynamic_image: { renderBody: jest.fn(), renderFooter: jest.fn() },
        output_open_question: { renderBody: jest.fn(), renderFooter: jest.fn() },
        output_choices: { renderBody: jest.fn(), renderFooter: jest.fn() }
    };

    const renderHeader = jest.fn();

    const renderFooter = jest.fn();

    test('Test mock function called', async () => {
        abstractRenderer(renderers, renderHeader, renderFooter)(blocks);

        expect(renderHeader).toBeCalled();
        expect(renderFooter).toBeCalled();

        Object.keys(renderers).forEach((i) => {
            let render = renderers[i];
            expect(render.renderBody).toBeCalled();
            expect(render.renderFooter).toBeCalled();
        });
    });
});