const {createRenderContext} = require("../../../abstract-renderer");

const {renderBody} = require('./input_dynamic_image');

describe('Toloka input_dynamic_image not highlightable', () => {

  test('should render a simple image', () => {
    // given
    const context = createRenderContext();
    const block = {
      csvVariable: 'image_url',
      highlightable: false
    };

    // when
    renderBody(block, context);

    // then
    expect(context.res.markup).toBe(`<img src="{{${block.csvVariable}}}" width="100%"/>`);
  });
});
