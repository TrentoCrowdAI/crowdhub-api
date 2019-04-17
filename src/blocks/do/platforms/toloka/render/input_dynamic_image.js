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

const renderImage = (block, {res}) => res.markup += `<img src="{{${block.csvVariable}}}" width="100%"/>`;

const renderHighlightableImage = (block, {res}) => {
  res.markup += `<p>${block.question}</p>`;
  res.markup += `{{field type="image-annotation" name="${block.highlightedCsvVariable}" src=${block.csvVariable}}}`;

  res.output_spec[block.highlightedCsvVariable] = {
    type: "json",
    required: false //define better
  };
};

module.exports = {
  renderBody
};
