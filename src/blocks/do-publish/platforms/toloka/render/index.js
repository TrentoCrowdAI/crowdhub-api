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
    res.output_spec.decision_time = {type: 'integer', required: false};
    res.javascript += fs.readFileSync(__dirname + '/resources/header_script.js').toString();
    res.markup =
      '<div class="paper-task">' +
      ' <input type="text" hidden name="decision-time"/>'; // TODO: This should work also without the hidden text. Try to remove it
};

const renderFooter = ({res}) => {
    res.markup += `</div>`;
    res.javascript += fs.readFileSync(__dirname + '/resources/footer_script.js').toString();
};

module.exports = abstractRenderer(renderers, renderHeader, renderFooter);
