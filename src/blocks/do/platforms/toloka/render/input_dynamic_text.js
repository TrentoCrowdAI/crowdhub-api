const render = (block, context) => {
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

const renderText = (block, {res}) => {
  res.markup += `
    <div>
        <h2>{{${elem.csvTitleVariable}}}</h2>
        <p>{{${elem.csvVariable}}}</p>
    </div>`;
};

const renderHighlightableText = (block, context) => {
  const res = context.res;

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
  </div>`;

  context.textHighlight = true;

  res.output_spec[elem.highlightedCsvVariable] = {
    type: "string",
    required: false //define better
  };
};

const renderFooter = (context) => {
  if (context.textHighlight) {
    addHighlightScriptsAndStyles(context);
  }
};

const addHighlightScriptsAndStyles = ({res}) => {
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
  render,
  renderFooter
};
