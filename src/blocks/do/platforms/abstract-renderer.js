const abstractRenderer = (renderers, renderHeader, renderFooter) => {

  const renderBlock = (block, context) => {
    const renderer = getRendererByBlock(block);
    renderer.render(block, context);
  };

  const getRendererByBlock = (block) => {
    const type = block.type;
    const renderer = renderers[type];
    if (!renderer) {
      throw new Error(`unknown block type "${type}"`);
    }
    return renderer;
  };

  const renderBlocksFooter = (context) => {
    Object.keys(renderers).forEach(renderer => {
      if (renderer.renderFooter) {
        renderer.renderFooter(context);
      }
    });
  };

  return (blocks) => {
    const context = createRenderContext();

    renderHeader(context);


    blocks.forEach(block => renderBlock(block, context));

    renderBlocksFooter(context);

    renderFooter(context);

    return context.res;
  };
};

const createRenderContext = () => ({
  res: {markup: '', javascript: '', css: '', input_spec: {}, output_spec: {}}
});


module.exports = abstractRenderer;
