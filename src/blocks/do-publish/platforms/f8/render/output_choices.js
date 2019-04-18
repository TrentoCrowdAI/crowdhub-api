const renderBody = (block, context) => {
  const res = context.res;

  let elem_tag, item_tag = '';
  switch (block.choice_type) {
    case 'multiple_checkbox':
      elem_tag = 'cml:checkboxes';
      item_tag = 'cml:checkbox';
      break;
    case 'single_radio':
      elem_tag = 'cml:radios';
      item_tag = 'cml:radio';
      break;
    case 'single_dropdown':
      elem_tag = 'cml:select';
      item_tag = 'cml:option';
      break;
  }
  let required = block.required ? 'validates="required"' : '';

  res.markup += `<${elem_tag} label="${block.question}" name="${block.csvVariable}" ${required}>`;
  for (let item of block.choices) {
    res.markup += `<${item_tag} label="${item.label}" value="${item.value}" />`;
  }
  res.markup += `</${elem_tag}>`;
};

module.exports = {
  renderBody
};
