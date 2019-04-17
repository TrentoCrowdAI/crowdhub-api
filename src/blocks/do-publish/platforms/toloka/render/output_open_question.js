const renderBody = (block, context) => {
  const res = context.res;

  let block_type = 'input';
  if (block.size == 'big')
    block_type = 'textarea';

  res.markup += `
    <div>
        <p>${block.question}</p>
        {{field type="${block_type}" name="${block.csvVariable}"}}
    </div>`;

  res.output_spec[block.csvVariable] = {
    type: "string",
    required: block.required
  };
};

module.exports = {
  renderBody
};
