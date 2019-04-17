const renderBody = (block, context) => {
  const res = context.res;

  res.markup += `
    <div>
        <p>${elem.question}</p>`;

  switch (elem.choice_type) {
    case 'multiple_checkbox': {
      let i = 1;
      for (let item of elem.choices) {
        res.markup += `{{field type="checkbox" name="${elem.csvVariable}" label="${item.label}" value="${item.value}" hotkey="${i}"}}`;
        i++;
      }
      break;
    }
    case 'single_radio': {
      let i = 1;
      for (let item of elem.choices) {
        res.markup += `{{field type="radio" name="${elem.csvVariable}" label="${item.label}" value="${item.value}" hotkey="${i}"}}`;
        i++;
      }
      break;
    }
    case 'single_dropdown': {
      res.markup += `{{#field type="select" name="${elem.csvVariable}"}}`;
      for (let item of elem.choices) {
        res.markup += `{{select_item value="${item.value}" text="${item.label}"}}`;
        i++;
      }
      res.markup += `{{/field}}`;
      break;
    }
  }

  res.markup += `</div>`;

  res.output_spec[elem.csvVariable] = {
    type: "string",
    required: elem.required
  };
};

module.exports = {
  renderBody
};
