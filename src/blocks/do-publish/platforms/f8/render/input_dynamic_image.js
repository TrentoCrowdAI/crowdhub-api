const renderBody = (block, context) => {
  const res = context.res;

  if (!block.highlightable) {
    renderImage(block, context);
  } else {
    renderHighlightableImage(block, context);
  }

  res.input_spec[block.csvVariable] = {
    type: "url",
    required: true
  };
};

const renderImage = (block, { res }) => res.markup += `<img src="{{${block.csvVariable.toLowerCase()}}}" />`;

const renderHighlightableImage = (block, { res }) => {
  res.markup += `<p>${block.question}</p>`;
  res.markup += `<cml:shapes type="['box']" image-url="{{${elem.csvVariable.toLowerCase()}}}" name="${elem.highlightedCsvVariable.toLowerCase()}" label="${elem.question}" validates="required" box-threshold="0.7" />`;

  res.output_spec[block.highlightedCsvVariable] = {
    type: "json",
    required: false //define better
  };
};

module.exports = {
  renderBody
};
