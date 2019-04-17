const renderBody = (block, context) => {
    if (!elem.highlightable) {
        renderText(block, context);
    } else {
        renderHighlightableText(block, context);
    }

    res.input_spec[elem.csvVariable] = {
        type: "string",
        required: true
    };
    res.input_spec[elem.csvTitleVariable] = {
        type: "string",
        required: true
    };
};

const renderText = (block, { res }) => {
    res.markup += `
    <div>
        <h2>{{${block.csvTitleVariable}}}</h2>
        <p>{{${block.csvVariable}}}</p>
    </div>`;
};

const renderHighlightableText = (block, context) => {
    const res = context.res;

    res.markup += `
    <div class="paper-container" data="${block.highlightedCsvVariable}">
        <h2>{{${block.csvTitleVariable}}}</h2>
        <p class="paper-text">{{${block.csvVariable}}}</p>
            
        <div>
            <button type="button" class="clear-all-highlights-button">Clear highlights</button> 
            <small class="small">Select from the text above to highlight the part that supports your decision.</small>
        </div>
    </div>
    
    <div class="highlighted_parts_container">
        <p>${block.question}</p>
            
        <!-- Hidden field that contains the higlighted parts of paper -->
        {{field type="textarea" name="${block.highlightedCsvVariable}"}}
    </div>`;

    context.textHighlight = true;

    res.output_spec[block.highlightedCsvVariable] = {
        type: "string",
        required: false //define better
    };
};

const renderFooter = (context) => {
    if (context.textHighlight) {
        addHighlightScriptsAndStyles(context);
    }
};

const addHighlightScriptsAndStyles = ({ res }) => {
    res.javascript += `
        exports.Task = extend(TolokaHandlebarsTask, function (options) {
            TolokaHandlebarsTask.call(this, options);
        }, {
        
            onRender: function() {
                const that = this;
        
                // When onRender is called, the question and the input fields are not attached to the DOM yet, so
                // we need to initialize the highlight library in the next loop
                setTimeout(function () {
                    initialize(that.getTask().id, that.getDOMElement());
                });
            },
        
            validate: function(solution) {
                // Copy the highlighted text on the solution object
                const id = this.getTask().id;
                for(let name_var of Object.keys(highlighters[id])){
                    solution.output_values[name_var] = updateHiddenField(id, name_var, false);
                }
                // then delegate the validation logic to Toloka
                return TolokaHandlebarsTask.prototype.validate.apply(this, arguments);
            },
        
        });
        
            
        const highlighters = {};
        
        function initialize (taskId, DOMElement) {
            if (highlighters[taskId]) {
                // Toloka updates the same page when the performer completes a HIT, so we need to clear
                // the last instance of the library
                highlighters[taskId].destroy();
                console.log('old highlighter destroyed');
            }
        
            const paperContainer = $(DOMElement).find('.paper-task');
        
            setupHighlighter(taskId, paperContainer);
        
            setupClearAllHighlightsButton();
            setupClearSingleHighlight();
        }
            
        function setupHighlighter (id, container) {
            const $container = $(container);
        
            // Assign an id
            $container.attr('data-paper-id', id);
            
            const paperTexts = $container.find('.paper-text');
            highlighters[id] = {};
            for(var paper of paperTexts) {
            let name_var = $(paper).parent().attr('data');
            //hide input text
            const $hiddenField = $('div.paper-task[data-paper-id=' + id + '] textarea[name=' + name_var + ']');
            $($hiddenField).css("width", "0px").css("height", "0px").css("padding", "0px").css("border", "0px");
            
            highlighters[id][name_var] = new TextHighlighter(paper, {
                onAfterHighlight: function (range) {
                    updateHiddenField(id, name_var, true);
                }
            });   
            }
        }
            
        function updateHiddenField (id, name_var, hideValidationErrorPopup) {
            if (hideValidationErrorPopup){
                $('div.highlighted_parts_container .popup').removeClass('popup_visible');
            }
        
            const highlithter = highlighters[id][name_var];
            const $hiddenField = $('div.paper-task[data-paper-id=' + id + '] textarea[name=' + name_var + ']');
        
            let json = "";
            if (highlithter.getHighlights().length > 0) {
                json = highlithter.serializeHighlights();
            }
                
            $hiddenField.val(json);
            return json;
        }
            
        function setupClearAllHighlightsButton () {
            $('button.clear-all-highlights-button').on('click', function (e) {
                e.preventDefault();
                    
                const id = $(e.currentTarget).parent().parent().parent().attr('data-paper-id');
                const name_var = $(e.currentTarget).parent().parent().attr('data');
                    
                highlighters[id][name_var].removeHighlights();
        
                updateHiddenField(id, name_var, true);
            });
        }
        
        function setupClearSingleHighlight () {
            $('.paper-container p').on('click', '.highlighted', function (e) {
                const $target = $(e.currentTarget);
                const id = $target.parent().parent().parent().attr('data-paper-id');
                const name_var = $target.parent().parent().attr('data');
                        if(id !== undefined && name_var !== undefined){
                highlighters[id][name_var].removeHighlights($target[0]);
        
                updateHiddenField(id, name_var, true);
                }
            });
        }
        
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

        .paper-container {
            border: 1px solid black;
            padding: 1em;
        }

        .paper-text {
            cursor: copy;
            position: relative;
        }

        textarea {
            width: 100%;
        }

        
        .field_type_textarea {
            width: 100%;
        }`;
};

module.exports = {
    renderBody,
    renderFooter
};
