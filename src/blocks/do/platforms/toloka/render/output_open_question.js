const renderBody = (block, context) => {
  const res = context.res;

  let elem_type = 'input';
  if (elem.size == 'big')
    elem_type = 'textarea';

  res.markup += `
    <div>
        <p>${elem.question}</p>
        {{field type="${elem_type}" name="${elem.csvVariable}"}}
    </div>`;

  res.output_spec[elem.csvVariable] = {
    type: "string",
    required: elem.required
  };
};

module.exports = {
  renderBody
};
