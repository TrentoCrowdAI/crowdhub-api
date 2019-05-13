enqueueOnRender(function (tolokaTask) {
    // When onRender is called, the question and the input fields are not attached to the DOM yet, so
    // we need to initialize the highlight library in the next loop
    setTimeout(function () {
        initialize(tolokaTask.getTask().id, tolokaTask.getDOMElement());
    });
});

const highlightersByTaskIdAndVariableName = {};

enqueueValidate(function (tolokaTask, solution) {
    // Copy the highlighted text on the solution object
    const id = tolokaTask.getTask().id;
    for (let name_var of Object.keys(highlightersByTaskIdAndVariableName[id])) {
        solution.output_values[name_var] = updateHiddenField(id, name_var, false);
    }
});


function initialize(taskId, DOMElement) {
    if (highlightersByTaskIdAndVariableName[taskId]) {
        // Toloka updates the same page when the performer completes a HIT, so we need to clear
        // the last instance of the library
        const highlightersByVariableName = highlightersByTaskIdAndVariableName[taskId];
        Object.keys(highlightersByVariableName).forEach(function(variableName) {
            highlightersByVariableName[variableName].destroy();
        });
        console.log('[input_dynamic_text_script] old highlighters destroyed');
    }

    const paperContainer = $(DOMElement).find('.paper-task');

    setupHighlighter(taskId, paperContainer);

    setupClearAllHighlightsButton();
    setupClearSingleHighlight();
}

function setupHighlighter(id, container) {
    const $container = $(container);

    // Assign an id
    $container.attr('data-paper-id', id);

    const paperTexts = $container.find('.paper-text');
    highlightersByTaskIdAndVariableName[id] = {};
    for (var paper of paperTexts) {
        let name_var = $(paper).parent().attr('data');
        //hide input text
        const $hiddenField = $('div.paper-task[data-paper-id=' + id + '] textarea[name=' + name_var + ']');
        $($hiddenField).css("width", "0px").css("height", "0px").css("padding", "0px").css("border", "0px");

        highlightersByTaskIdAndVariableName[id][name_var] = new TextHighlighter(paper, {
            onAfterHighlight: function (range) {
                updateHiddenField(id, name_var, true, true);
            }
        });
    }
}

function updateHiddenField(id, name_var, hideValidationErrorPopup, emitChangeEvent = false) {
    if (hideValidationErrorPopup) {
        $('div.highlighted_parts_container .popup').removeClass('popup_visible');
    }

    const highlithter = highlightersByTaskIdAndVariableName[id][name_var];
    const $hiddenField = $('div.paper-task[data-paper-id=' + id + '] textarea[name=' + name_var + ']');

    let json = "";
    if (highlithter.getHighlights().length > 0) {
        json = highlithter.serializeHighlights();
    }

    $hiddenField.val(json);
    if (emitChangeEvent) {
        $hiddenField.trigger('change');
    }
    return json;
}

function setupClearAllHighlightsButton() {
    $('button.clear-all-highlights-button').on('click', function (e) {
        e.preventDefault();

        const id = $(e.currentTarget).parent().parent().parent().attr('data-paper-id');
        const name_var = $(e.currentTarget).parent().parent().attr('data');

        highlightersByTaskIdAndVariableName[id][name_var].removeHighlights();

        updateHiddenField(id, name_var, true);
    });
}

function setupClearSingleHighlight() {
    $('.paper-container p').on('click', '.highlighted', function (e) {
        const $target = $(e.currentTarget);
        const id = $target.parent().parent().parent().attr('data-paper-id');
        const name_var = $target.parent().parent().attr('data');
        if (id !== undefined && name_var !== undefined) {
            highlightersByTaskIdAndVariableName[id][name_var].removeHighlights($target[0]);

            updateHiddenField(id, name_var, true);
        }
    });
}
