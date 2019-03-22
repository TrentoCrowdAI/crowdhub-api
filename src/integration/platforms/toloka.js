const fetch = require('node-fetch');
const neatCsv = require('neat-csv');

const config = require(__base + 'config/index');

/**
 * Publish the job parameter on the Toloka platform as a new job.
 * @param {{}} job 
 */
const publish = async (job) => {
    //let inOutParams = await markupToInOutParams(job);
    let param = renderDesign(job);
    job = await createProject(job, param);

    job = await createTaskPool(job);

    let tasks = await csvToTasks(job, job.data.items_csv, param);
    let gold_tasks = await csvToTasks(job, job.data.items_gold_csv, param);

    job = await createTasks(job, tasks, param);
    job = await createTasks(job, gold_tasks, param);

    return job;
};

/**
 * Create a new project on Toloka
 * @param {{}} job 
 * @param {{}} inOutParams 
 */
const createProject = async (job, param) => {
    let url = config.toloka.baseEndpoint + 'projects';

    let body = {
        public_name: job.data.name,
        public_description: job.data.description,
        public_instructions: job.data.instructions,
        task_spec: {
            input_spec: param.input_spec,
            output_spec: param.output_spec,
            view_spec: {
                assets: {
                    script_urls: [
                        "https://code.jquery.com/jquery-3.3.1.min.js",
                        "https://cdnjs.cloudflare.com/ajax/libs/texthighlighter/1.2.0/TextHighlighter.min.js",
                        "$TOLOKA_ASSETS/js/toloka-handlebars-templates.js"
                    ]
                },
                markup: param.markup,
                script: param.javascript,
                styles: param.css,
                settings: {
                    showSkip: true,
                    showTimer: true,
                    showTitle: true,
                    showSubmit: true,
                    showFullscreen: true,
                    showInstructions: true
                }
            }
        },
        assignments_issuing_type: "AUTOMATED"

    };

    let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken,
            'Content-Type': 'application/JSON'
        }
    });

    if (res.status !== 201)
        throw new Error('Toloka Error: Not able to create a new Project!');

    let json = await res.json();

    if (job.data.platform === undefined)
        job.data.platform = {};

    if (job.data.platform.toloka === undefined)
        job.data.platform.toloka = {};

    job.data.platform.toloka.project = json;

    return job;
};

/**
 * Create a new task pool on Toloka
 * @param {{}} job 
 */
const createTaskPool = async (job) => {
    let url = config.toloka.baseEndpoint + 'pools';

    let body = {
        project_id: job.data.platform.toloka.project.id,
        private_name: 'pool',
        may_contain_adult_content: false,
        will_expire: '2022-03-11T12:00:00',         //TODO: change
        reward_per_assignment: job.data.reward,
        assignment_max_duration_seconds: 60,
        defaults: {
            default_overlap_for_new_task_suites: 1
        }
    };

    let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken,
            'Content-Type': 'application/JSON'
        }
    });

    if (res.status !== 201)
        throw new Error('Toloka Error: Not able to create a new Pool!');

    let json = await res.json();

    if (job.data.platform === undefined)
        job.data.platform = {};

    if (job.data.platform.toloka === undefined)
        job.data.platform.toloka = {};

    job.data.platform.toloka.pool = json;

    return job;

};

/**
 * Extract from the markup part of the job parameter the input and output fields
 * @param {{}} job 
 */
const markupToInOutParams = async (job) => {
    let regInput = /{{([^\ ]+)}}/igm;
    let regOutput = /{field.*name=\"([^\ ]+)\".*}}/igm;

    let input = (job.data.design.markup.match(regInput) || []).map(e => e.replace(regInput, '$1'));
    let output = [...new Set((job.data.design.markup.match(regOutput) || []).map(e => e.replace(regOutput, '$1')))];

    let inOutSpec = { input_spec: {}, output_spec: {} };

    for (let inp of input) {
        inOutSpec.input_spec[inp] = {
            type: 'string'
        };
    }

    for (let out of output) {
        inOutSpec.output_spec[out] = {
            type: 'string'
        };
    }

    return inOutSpec;
};

/**
 * Convert a CSV file for F8 to an array of Toloka tasks
 * @param {{}} job 
 * @param {String} csvFile URL to the CSV file
 * @param {{}} inOutParams input and output Toloka fields
 */
const csvToTasks = async (job, csvFile, inOutParams) => {
    let tasks = [];

    let csvReq = await fetch(csvFile);
    let csvData = await csvReq.text();
    let data = await neatCsv(csvData);

    for (let el of data) {
        let headers = Object.keys(el);

        let task = {
            pool_id: job.data.platform.toloka.pool.id,
            input_values: {},
            overlap: 1
        };

        for (let key of headers) {
            if (Object.keys(inOutParams.input_spec).indexOf(key) != -1) {
                task.input_values[key] = el[key];
            }
            else if (key.endsWith('_gold')) {
                //gold item
                pos = key.indexOf('_gold');

                let fieldName = key.substring(0, pos);
                if (Object.keys(inOutParams.output_spec).indexOf(fieldName) != -1) {
                    if (task.known_solutions === undefined)
                        task.known_solutions = [{ output_values: {}, correctness_weight: 1 }];

                    task.known_solutions[0].output_values[fieldName] = el[key];
                }
            }
        }

        if (task.known_solutions !== undefined) {
            //fill with missing gold items in order to avoid errors
            for (let gold of Object.keys(inOutParams.output_spec)) {
                if (task.known_solutions[0].output_values[gold] === undefined)
                    task.known_solutions[0].output_values[gold] = '';
            }
        }

        tasks.push(task);
    }

    return tasks;
};

/**
 * Create new tasks on Toloka
 * @param {{}} job 
 * @param {[]} tasks 
 */
const createTasks = async (job, tasks) => {
    let url = config.toloka.baseEndpoint + 'tasks';

    let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(tasks),
        headers: {
            'Authorization': 'OAuth ' + config.toloka.accessToken,
            'Content-Type': 'application/JSON'
        }
    });

    if (res.status !== 201)
        throw new Error('Toloka Error: Not able to create new Tasks!');

    let json = await res.json();

    return job;
};

/**
 * Create the Toloka markup, js and CSS based on the job design
 * @param {{}} job 
 */
const renderDesign = (job) => {
    let res = { markup: '', javascript: '', css: '', input_spec: {}, output_spec: {} };
    let highlightText = [];

    res.markup = `<div class="paper-task">`;

    for (let elem of job.data.design) {
        switch (elem.type) {
            case 'input_dynamic_text': {
                if (!elem.highlightable)
                    res.markup += `
                        <div>
                            <h2>{{${elem.csvTitleVariable}}}</h2>
                            <p>{{${elem.csvVariable}}}</p>
                        </div>`;
                else {
                    res.markup += `
                    <div class="paper-container-${elem.highlightedCsvVariable}">
                        <h2>{{${elem.csvTitleVariable}}}</h2>
                        <p class="paper-text">{{${elem.csvVariable}}}</p>
                            
                        <div>
                            <button type="button" class="clear-all-highlights-button-${elem.highlightedCsvVariable}">Clear highlights</button> 
                            <small class="small">Select from the text above to highlight the part that supports your decision.</small>
                        </div>
                    </div>
                    
                    <div class="highlighted_parts_container-${elem.highlightedCsvVariable}">
                        <p>${elem.question}</p>
                            
                        <!-- Hidden field that contains the higlighted parts of paper -->
                        {{field type="textarea" name="${elem.highlightedCsvVariable}"}}
                    </div>
                    `;

                    highlightText.push(elem.highlightedCsvVariable);

                    res.output_spec[elem.highlightedCsvVariable] = {
                        type: "string",
                        required: false //define better
                    };
                }

                res.input_spec[elem.csvVariable] = {
                    type: "string",
                    required: true
                };
                res.input_spec[elem.csvTitleVariable] = {
                    type: "string",
                    required: true
                };
                break;
            }
            case 'input_static_text': {
                res.markup += `<p>${elem.text}</p>`;
                break;
            }
            case 'input_dynamic_image': {
                if (!elem.highlightable)
                    res.markup += `dyn image TODO`;
                else
                    res.markup += `dyn image highlight TODO`;
                break;
            }
            case 'output_open_question': {
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

                break;
            }
            case 'output_choices': {
                res.markup += `
                <div>
                    <p>${elem.question}</p>
                `;

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
                break;
            }
        }
    }

    res.markup += `</div>`;

    //add js and css for highlighting parts
    if (highlightText.length > 0) {
        let init = '';
        let assign = '';
        for (let varsText of highlightText) {
            init += `initialize${varsText}(that.getTask().id, that.getDOMElement());`;
            assign += `solution.output_values.${varsText} = updateHiddenField${varsText}(id, false);`;
        }

        res.javascript += `
        exports.Task = extend(TolokaHandlebarsTask, function (options) {
            TolokaHandlebarsTask.call(this, options);
        }, {
            onRender: function() {
                const that = this;
                // When onRender is called, the question and the input fields are not attached to the DOM yet, so
                // we need to initialize the highlight library in the next loop
                setTimeout(function () {
                    ${init}
                });
            },
            validate: function(solution) {
                // Copy the highlighted text on the solution object
                const id = this.getTask().id;
                
                ${assign}

                // then delegate the validation logic to Toloka
                return TolokaHandlebarsTask.prototype.validate.apply(this, arguments);
            },
        });`;

        for (let varsText of highlightText) {
            res.javascript += `
            const highlighters${varsText} = {};
            function initialize${varsText} (taskId, DOMElement) {
                if (highlighters${varsText}[taskId]) {
                    // Toloka updates the same page when the performer completes a HIT, so we need to clear
                    // the last instance of the library
                    highlighters${varsText}[taskId].destroy();
                    console.log('old highlighter destroyed');
                }
                const paperContainer = $(DOMElement).find('.paper-container-${varsText}');
                setupHighlighter${varsText}(taskId, paperContainer);
                setupClearAllHighlightsButton${varsText}();
                setupClearSingleHighlight${varsText}();
            }
                
            function setupHighlighter${varsText} (id, container) {
                const $container = $(container);
                // Assign an id
                $container.attr('data-paper-id', id);
                
                const paperText = $container.find('.paper-text')[0];
                highlighters${varsText}[id] = new TextHighlighter(paperText, {
                    onAfterHighlight: function (range) {
                        updateHiddenField${varsText}(id, true);
                    }
                });   
            }
                
            function updateHiddenField${varsText} (id, hideValidationErrorPopup) {
                if (hideValidationErrorPopup){
                    $('div.highlighted_parts_container-${varsText} .popup').removeClass('popup_visible');
                }
                const highlithter = highlighters${varsText}[id];
                const $hiddenField = $('div.paper-container-${varsText}[data-paper-id=' + id + ']').parent().find('textarea[name=${varsText}]');
                let json = "";
                if (highlithter.getHighlights().length > 0) {
                    json = highlithter.serializeHighlights();
                }
                
                $($hiddenField).val(json);
                return json;
            }
                
            function setupClearAllHighlightsButton${varsText} () {
                $('button.clear-all-highlights-button-${varsText}').on('click', function (e) {
                    e.preventDefault();
                        
                    const id = $(e.currentTarget).parent().parent().attr('data-paper-id');
                        
                    highlighters${varsText}[id].removeHighlights();
                    updateHiddenField${varsText}(id, true);
                });
            }
               
            function setupClearSingleHighlight${varsText} () {
                $('.paper-container-${varsText} p').on('click', '.highlighted', function (e) {
                    const $target = $(e.currentTarget);
                    const id = $target.parent().parent().attr('data-paper-id');
                    if(id !== undefined){
                        highlighters${varsText}[id].removeHighlights($target[0]);
                        
                        updateHiddenField${varsText}(id, true);
                    }
                });
            }
            `;

            res.css += `
            textarea.textarea__textarea[name=${varsText}] {
                height: 0;
                width: 0;
                padding: 0;
                overflow: hidden;
                border: 0;
                resize: none;
                outline: none !important;
                background: transparent;
                color: transparent;
          
                box-shadow: none;
                -webkit-box-shadow: none;
                -moz-box-shadow: none;    
            }
            .paper-container-${varsText} {
                border: 1px solid black;
                padding: 1em;
            }`;
        }

        res.javascript += `
        // utility function given by F8
            function extend(ParentClass, constructorFunction, prototypeHash) {
              constructorFunction = constructorFunction || function () {};
              prototypeHash = prototypeHash || {};
              if (ParentClass) {
                constructorFunction.prototype = Object.create(ParentClass.prototype);
              }
              for (var i in prototypeHash) {
                constructorFunction.prototype[i] = prototypeHash[i];
              }
              return constructorFunction;
            }`;
        res.css += `
        .highlighted:hover:before {
            color: white;
            content: "×";
            position: absolute;
            padding-left: 2px;
            padding-right: 2px;
            background: black;
            padding-left: 2px;
        }
        .paper-text {
            cursor: copy;
        }
        textarea {
            width: 100%;
        }        
        .field_type_textarea {
            width: 100%;
        }`;
    }

    return res;
};

module.exports = {
    publish
};