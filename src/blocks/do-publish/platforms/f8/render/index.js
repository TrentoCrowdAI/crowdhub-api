const fs = require('fs');
const abstractRenderer = require(__base + 'blocks/do-publish/abstract-renderer');

const renderers = {
  input_dynamic_text: require('./input_dynamic_text'),
  input_static_text: require('./input_static_text'),
  input_dynamic_image: require('./input_dynamic_image'),
  output_open_question: require('./output_open_question'),
  output_choices: require('./output_choices')
};

const renderHeader = ({res}) => {
  res.javascript += fs.readFileSync(__dirname + '/resources/header_script.js').toString();
  res.markup += '<cml:hidden name="decision-time" />'
};

const renderFooter = ({res}) => {
    res.javascript += fs.readFileSync(__dirname + '/resources/footer_script.js').toString();
};

module.exports = abstractRenderer(renderers, renderHeader, renderFooter);
