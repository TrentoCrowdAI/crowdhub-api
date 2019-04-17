const renderBody = (block, context) => {
  const res = context.res;

  res.markup += `
    <div>
        <p>${block.question}</p>`;

  switch (block.choice_type) {
    case 'multiple_checkbox': {
      let i = 1;
      for (let item of block.choices) {
        res.markup += `{{field type="checkbox" name="${block.csvVariable}" label="${item.label}" value="${item.value}" hotkey="${i}"}}`;
        i++;
      }
      break;
    }
    case 'single_radio': {
      let i = 1;
      for (let item of block.choices) {
        res.markup += `{{field type="radio" name="${block.csvVariable}" label="${item.label}" value="${item.value}" hotkey="${i}"}}`;
        i++;
      }
      break;
    }
    case 'single_dropdown': {
      res.markup += `{{#field type="select" name="${block.csvVariable}"}}`;
      for (let item of block.choices) {
        res.markup += `{{select_item value="${item.value}" text="${item.label}"}}`;
        i++;
      }
      res.markup += `{{/field}}`;
      break;
    }
  }

  res.markup += `</div>`;

  res.output_spec[block.csvVariable] = {
    type: "string",
    required: block.required
  };
};

module.exports = {
  renderBody
};
