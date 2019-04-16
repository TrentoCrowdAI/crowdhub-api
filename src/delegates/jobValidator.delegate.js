const errHandler = require(__base + 'utils/errors');

const checkJob = (job) => {
    if (!(job instanceof Object)) {
        throw errHandler.createBusinessError('Job not defined or not valid!');
    }
    if (!(job.data instanceof Object)) {
        throw errHandler.createBusinessError('Job data not defined or not valid!');
    }
    if (typeof job.data.name != "string") {
        throw errHandler.createBusinessError('Name of the job not defined or not valid!');
    }
    if (typeof job.data.description != "string") {
        throw errHandler.createBusinessError('Description not defined or not valid!');
    }
    if (typeof job.data.numVotes != "number") {
        throw errHandler.createBusinessError('NumVotes not defined or not valid!');
    }
    if (typeof job.data.maxVotes != "number") {
        throw errHandler.createBusinessError('MaxVotes not defined or not valid!');
    }
    if (typeof job.data.reward != "number") {
        throw errHandler.createBusinessError('Reward not defined or not valid!');
    }
    if (typeof job.data.items_csv != "string") {
        throw errHandler.createBusinessError('Items CSV URL not defined or not valid!');
    }
    if (typeof job.data.items_gold_csv != "string") {
        throw errHandler.createBusinessError('Items Gold CSV URL not defined or not valid!');
    }
    if (typeof job.data.instructions != "string") {
        throw errHandler.createBusinessError('Instructions not defined or not valid!');
    }
    if (!(job.data.design instanceof Array)) {
        throw errHandler.createBusinessError('Design not defined or not valid!');
    }

    checkJobMarkup(job);
};

const checkJobMarkup = (job) => {
    let index = 0;
    for (let elem of job.data.design) {
        index++;
        if (typeof elem.type != "string")
            throw errHandler.createBusinessError(`Job design validation: 'type' of element #${index} is not valid!`);

        switch (elem.type) {
            case 'input_dynamic_text': {
                if (typeof elem.csvTitleVariable != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'csvTitleVariable' of element #${index} is not valid!`);
                if (typeof elem.csvVariable != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'csvVariable' of element #${index} is not valid!`);
                if (elem.highlightable) {
                    if (typeof elem.question != "string")
                        throw errHandler.createBusinessError(`Job design validation: 'question' of element #${index} is not valid!`);
                    if (typeof elem.highlightedCsvVariable != "string")
                        throw errHandler.createBusinessError(`Job design validation: 'highlightedCsvVariable' of element #${index} is not valid!`);
                }
                break;
            }
            case 'input_static_text': {
                if (typeof elem.text != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'text' of element #${index} is not valid!`);
                break;
            }
            case 'input_dynamic_image': {
                if (typeof elem.csvVariable != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'csvVariable' of element #${index} is not valid!`);

                if (elem.highlightable) {
                    if (typeof elem.question != "string")
                        throw errHandler.createBusinessError(`Job design validation: 'question' of element #${index} is not valid!`);
                    if (typeof elem.highlightedCsvVariable != "string")
                        throw errHandler.createBusinessError(`Job design validation: 'highlightedCsvVariable' of element #${index} is not valid!`);
                }
                break;
            }
            case 'output_open_question': {
                if (typeof elem.question != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'question' of element #${index} is not valid!`);
                if (typeof elem.csvVariable != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'csvVariable' of element #${index} is not valid!`);

                if (typeof elem.size != "string" || (elem.size != 'slim' && elem.size != 'big'))
                    throw errHandler.createBusinessError(`Job design validation: 'size' of element #${index} is not valid!`);
                break;
            }
            case 'output_choices': {
                if (typeof elem.question != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'question' of element #${index} is not valid!`);
                if (typeof elem.csvVariable != "string")
                    throw errHandler.createBusinessError(`Job design validation: 'csvVariable' of element #${index} is not valid!`);

                if ((typeof elem.choice_type != "string") || 
                    (elem.choice_type != 'multiple_checkbox' && elem.choice_type != 'single_radio' && elem.choice_type != 'single_dropdown'))
                    throw errHandler.createBusinessError(`Job design validation: 'choice_type' of element #${index} is not valid!`);

                for (let item of elem.choices) {
                    if (typeof item.label != "string")
                        throw errHandler.createBusinessError(`Job design validation: 'label' of element #${index} choice is not valid!`);
                    if (typeof item.value != "string")
                        throw errHandler.createBusinessError(`Job design validation: 'value' of element #${index} choice is not valid!`);
                }
                break;
            }
            default: {
                throw errHandler.createBusinessError(`Job design validation: '${elem.type}' is not a valid type!`);
            }
        }
    }
};

module.exports = checkJob;