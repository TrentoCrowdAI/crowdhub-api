const abstractRenderer = (renderers, renderHeader, renderFooter) => {

  /**
   * Renders the entire jobs, composed by an header of the job, the body of every block, the footer for every block type
   * and the footer of the job.
   * @param blocks
   * @param context
   */
  const renderJob = (blocks, context) => {
    renderHeader(context);
    blocks.forEach(block => renderBlockBody(block, context));
    renderBlocksFooter(context);
    renderFooter(context);
  };

  const renderBlockBody = (block, context) => {
    const renderer = getRendererByBlock(block);
    renderer.renderBody(block, context);
  };

  /**
   * Renders the footer of every block type.
   * The footer of a block is optional, one block has a footer only if it has the renderFooter method.
   * The renderFooter method will be called only once for every block type. It is the responsibility of the block type
   * to decide whether or not the footer it's needed (that is, renderFotter will be called on every block type, even
   * if the job design doesn't use that block type).
   * @param context
   */
  const renderBlocksFooter = (context) => {
    Object.keys(renderers).forEach(renderer => {
      if (renderers[renderer].renderFooter) {
        renderers[renderer].renderFooter(context);
      }
    });
  };

  const getRendererByBlock = (block) => {
    const type = block.type;
    const renderer = renderers[type];
    if (!renderer) {
      throw new Error(`unknown block type "${type}"`);
    }
    return renderer;
  };

  return (blocks) => {
    const context = createRenderContext();
    renderJob(blocks, context);
    return context.res;
  };
};

const createRenderContext = () => ({
  res: {markup: '', javascript: '', css: '', input_spec: {}, output_spec: {}}
});


module.exports = abstractRenderer;
module.exports.createRenderContext = createRenderContext;
