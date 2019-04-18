const renderBody = (block, context) => {
  const res = context.res;

  if (!block.highlightable) {
    renderImage(block, context);
  } else {
    renderHighlightableImage(block, context);
  }
};

const renderImage = (block, { res }) => res.markup += `<img src="{{${block.csvVariable}}}" />`;

const renderHighlightableImage = (block, { res }) => {
  res.markup += `<p>${block.question}</p>`;
  res.markup += `<cml:shapes type="['box']" image-url="{{${block.csvVariable}}}" name="${block.highlightedCsvVariable}" label="${block.question}" validates="required" box-threshold="0.7" />`;
};

module.exports = {
  renderBody
};
