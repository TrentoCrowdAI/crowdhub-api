const fetch = require('node-fetch');
const querystring = require('querystring');

const config = require(__base + 'config/index');
const sleep = require(__base + 'utils/utils').sleep;

/**
 * Publish the job parameter on the F8 platform as a new job.
 * @param {{}} job 
 */
const publish = async (job) => {
    job = await createNewJob(job);

    await sleep(250);

    //add items
    job = await addCsvItems(job, job.data.items_csv);

    await sleep(250);

    //add gold items
    job = await addCsvItems(job, job.data.items_gold_csv);
    await sleep(250);

    //recognise gold items
    await convertGoldQuestions(job);
    await sleep(250);

    //render the design of the job
    let design = renderDesign(job);

    //set the design of the job
    job = await updateJobMarkup(job, design);
    await sleep(250);
    job = await updateJobJS(job, design);
    await sleep(250);
    job = await updateJobCSS(job, design);
    await sleep(250);

    //set the reward info of the job
    job = await updateJobSpec(job);

    return job;
};

/**
 * Create a new job on F8
 * @param {{}} job
 */
const createNewJob = async (job) => {
    let url = config.f8.baseEndpoint + 'jobs.json?key=' + config.f8.apiKey;

    let newJob = {
        'job[title]': job.data.name,
        'job[instructions]': job.data.instructions
    };
    let body = querystring.stringify(newJob);

    let res = await fetch(url, {
        method: 'post',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to create a new Job!');

    let json = await res.json();

    if (job.data.platform === undefined)
        job.data.platform = {};

    job.data.platform.f8 = json;

    return job;
};

/**
 * Add some items to an existing F8 job using a CSV file
 * @param {{}} job 
 * @param {string} csvFile URL to the CSV file
 */
const addCsvItems = async (job, csvFile) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}/upload.json?key=${config.f8.apiKey}&force=true`;

    let csvReq = await fetch(csvFile);
    let csvData = await csvReq.text();

    let res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/csv'
        },
        body: csvData
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to add CSV items to the Job!');

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the Markup of an existing F8 job
 * @param {{}} job 
 */
const updateJobMarkup = async (job, design) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[cml]': design.markup
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the Markup of the Job!');

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the JS of an existing F8 job
 * @param {{}} job 
 */
const updateJobJS = async (job, design) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[js]': design.javascript
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the JS of the Job!');

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the CSS of an existing F8 job
 * @param {{}} job 
 */
const updateJobCSS = async (job, design) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[css]': design.css
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the CSS of the Job!');

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Update the job reward, maxVotes and numVotes on an existing F8 job
 * @param {{}} job 
 */
const updateJobSpec = async (job) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}.json?key=${config.f8.apiKey}`;

    let data = {
        'job[payment_cents]': job.data.reward,
        'job[max_judgments_per_worker]': job.data.maxVotes,
        'job[judgments_per_unit]': job.data.numVotes
    };
    let body = querystring.stringify(data);

    let res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to update the payment specific of the Job!');

    let json = await res.json();
    job.data.platform.f8 = json;

    return job;
};

/**
 * Convert the loaded Gold items of an existing job into test questions
 * @param {{}} job 
 */
const convertGoldQuestions = async (job) => {
    let url = config.f8.baseEndpoint + `jobs/${job.data.platform.f8.id}/gold.json?key=${config.f8.apiKey}`;
    let res = await fetch(url, {
        method: 'PUT'
    });

    if (res.status !== 200)
        throw new Error('F8 Error: Not able to convert the Gold Questions of the Job!');
};

/**
 * Create the F8 markup, js and CSS based on the job design
 * @param {{}} job 
 */
const renderDesign = (job) => {
    let res = { markup: '', javascript: '', css: '' };
    let highlightText = [];

    for (let elem of job.data.design) {
        switch (elem.type) {
            case 'input_dynamic_text': {
                if (!elem.highlightable)
                    res.markup += `
                        <h2>{{${elem.csvTitleVariable.toLowerCase()}}}</h2>
                        <p>{{${elem.csvVariable.toLowerCase()}}}</p>`;
                else {
                    res.markup += `
                    <div class="html-element-wrapper marker-target-${elem.highlightedCsvVariable.toLowerCase()}">
                        <h2>{{${elem.csvTitleVariable.toLowerCase()}}}</h2>
                        <p>{{${elem.csvVariable.toLowerCase()}}}</p>                  
                        <div>
                            <button class="opt-clear-${elem.highlightedCsvVariable.toLowerCase()}">Clear highlights</button> 
                            <small class="small">Select from the text above to highlight the part that supports your decision.</small>
                        </div>
                    </div>
                    <!-- Hidden field -->
                    <cml:textarea label="${elem.question}" validates="required" name="${elem.highlightedCsvVariable.toLowerCase()}"/>`;

                    highlightText.push(elem.highlightedCsvVariable.toLowerCase());
                }
                break;
            }
            case 'input_static_text': {
                res.markup += `<p>${elem.text}</p>`;
                break;
            }
            case 'input_dynamic_image': {
                if (!elem.highlightable)
                    res.markup += `<img src="{{${elem.csvVariable.toLowerCase()}}}"/>`;
                else
                    res.markup += `
                        <p>${elem.question}</p> 
                        <cml:shapes type="['box']" image-url="{{${elem.csvVariable.toLowerCase()}}}" name="${elem.highlightedCsvVariable.toLowerCase()}" label="${elem.question}" validates="required" box-threshold="0.7" />`;
                break;
            }
            case 'output_open_question': {
                let elem_tag = 'cml:text';
                if (elem.size == 'big')
                    elem_tag = 'cml:textarea';
                let required = elem.required ? 'validates="required"' : '';

                res.markup += `<${elem_tag} label="${elem.question}" name="${elem.csvVariable.toLowerCase()}" ${required} />`;
                break;
            }
            case 'output_choices': {
                let elem_tag, item_tag = '';
                switch (elem.choice_type) {
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
                let required = elem.required ? 'validates="required"' : '';

                res.markup += `<${elem_tag} label="${elem.question}" name="${elem.csvVariable.toLowerCase()}" ${required}>`;
                for (let item of elem.choices) {
                    res.markup += `<${item_tag} label="${item.label}" value="${item.value}" />`;
                }
                res.markup += `</${elem_tag}>`;
                break;
            }
        }
    }

    //add js and css for highlighting parts
    if (highlightText.length > 0) {
        res.javascript += `
        document.addEvent('domready', function() {
            try {
                require({
                    paths: {
                        "jquery-ui": "https://code.jquery.com/ui/1.11.3/jquery-ui.min",
                        "TextHighlighter": "https://cdnjs.cloudflare.com/ajax/libs/texthighlighter/1.2.0/TextHighlighter.min"
                    },
                    map: {
                        "*": {
                            "jquery": "jquery-noconflict"
                        }
                    }
                }, ["jquery-noconflict", "jquery-ui", "TextHighlighter"], function($) {
                    onLibrariesLoaded($);
                });
            } catch (e) {
                console.error(e);
            }
        })
        function onLibrariesLoaded($) {
            // Utility function used later to hide the validation error popup
            $.fn.focusWithoutScrolling = function() {
                var x = window.scrollX,
                    y = window.scrollY;
                this.focus();
                window.scrollTo(x, y);
                return this;
            };`;

        for (let varsText of highlightText) {
            res.javascript += `
            // Handles to the objects created by the highlight library.
            // There is a handle for every paper.
            var handlers${varsText} = [];
            // Initialize the highlite libraries for every paper and setups
            // listeners to clear the highlighted parts
            function initialize${varsText} () {
                var papers = $(".marker-target-${varsText} p");
                for (var i = 0; i < papers.length; i++) {
                    var paper = papers[i];
                    var id = $(paper).parent().parent().attr('id');
                    var hand = new TextHighlighter(paper, {
                        onAfterHighlight: afterHighlight${varsText}
                    });
                    handlers${varsText}[id] = hand;
                }
                setupClearSingleHighlight${varsText}();
                setupClearAllHighlightsButton${varsText}();
            }
            initialize${varsText}();
            function afterHighlight${varsText}(range, normalizedHighlights, timestamp) {
                var id = $(range.commonAncestorContainer).parent().parent().attr('id');
                updateHiddenField${varsText}(handlers${varsText}[id]);
                hideValidationError${varsText}(range);
            };
            // Add the listener to handle a click on an highlighted part (to remove it)
            function setupClearSingleHighlight${varsText} () {
                $(".marker-target-${varsText} p").on("click", ".highlighted", function(e) {
                    var $el = $(e.currentTarget);
                    var id = $el.parent().parent().parent().attr('id');
                    handlers${varsText}[id].removeHighlights($el[0]);
                    updateHiddenField${varsText}(handlers${varsText}[id]);
                });
            }
            // Add the listneer for the button to clear all the highlights of a paper
            function setupClearAllHighlightsButton${varsText}() {
                $(".opt-clear-${varsText}").click(function(e) {
                    e.preventDefault();
                    var id = $(e.currentTarget).parent().parent().parent().attr('id');
                    handlers${varsText}[id].removeHighlights();
                    updateHiddenField${varsText}(handlers${varsText}[id]);
                });
            }
            function updateHiddenField${varsText}(marks) {
                $hiddenField = $(marks.el).parents().filter(".cml").children().find(".${varsText}");
                var pattern = "";
                if (marks.getHighlights().length > 0) {
                    pattern = marks.serializeHighlights();
                }
                $hiddenField.val(pattern);
            };
            function hideValidationError${varsText} (marks) {
                $els = $(marks.commonAncestorContainer).parents().filter(".cml").children();
                $hiddenField = $els.parents().filter(".cml").children().find(".${varsText}");
                // This is just to make the error message dissapear when selecting
                // the pattern after a validation error
                if ($els.find(".${varsText}").hasClass("validation-failed")) {
                    $hiddenField.focusWithoutScrolling();
                    $els.filter(".cml").children().find(".excl_crit").focusWithoutScrolling();
                }
            }
            `;

            res.css += `
            .marker-target-${varsText} p {
                cursor: copy;
            }
            .cml_row .${varsText} {
                height: 0 !important;
                width: 0 !important;
                overflow: auto !important;
                border: 0px !important;
                padding: 0px !important;
                resize: none !important;
                outline: none !important;
                background: transparent !important;
                color: transparent !important;
                
                box-shadow: none !important;
                -webkit-box-shadow: none !important;
                -moz-box-shadow: none !important;  
            }
            `;
        }

        res.javascript += `}`;
        res.css += `        
            .disable-manual p {
                margin-top: -30px;
            }
            .highlighted {
                cursor: pointer;
            }
            .highlighted:hover:before {
                color: white;
                content: "×";
                position: absolute;
                padding-left: 2px;
                padding-right: 2px;
                background: black;
                padding-left: 2px;
            }`;
    }

    return res;
};

module.exports = {
    publish
};