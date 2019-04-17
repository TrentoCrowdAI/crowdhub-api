const abstractRenderer = require(__base + 'blocks/do/abstract-renderer');

const renderers = {
  input_dynamic_text: require('./input_dynamic_text'),
  input_static_text: require('./input_static_text'),
  input_dynamic_image: require('./input_dynamic_image'),
  output_open_question: require('./output_open_question'),
  output_choices: require('./output_choices')
};

const renderHeader = ({res}) => {};

const renderFooter = ({res}) => {};

module.exports = abstractRenderer(renderers, renderHeader, renderFooter);
