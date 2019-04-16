const types = {
    input_dynamic_text: require('./input_dynamic_text'),
    input_static_text: require('./input_static_text'),
    input_dynamic_image: require('./input_dynamic_image'),
    output_open_question: require('./output_open_question'),
    output_choices: require('./output_choices')
};

const render = (block) => {
    for (let type of Object.keys(types)) {
        if (type === block.type) {
            return types[type](block);
        }
    }
}

module.exports = render;