const renderBody = (block, context) => {
  const res = context.res;

  let elem_tag = 'cml:text';
  if (block.size == 'big')
    elem_tag = 'cml:textarea';
  let required = block.required ? 'validates="required"' : '';

  res.markup += `<${elem_tag} label="${block.question}" name="${block.csvVariable.toLowerCase()}" ${required} />`;
};

module.exports = {
  renderBody
};
