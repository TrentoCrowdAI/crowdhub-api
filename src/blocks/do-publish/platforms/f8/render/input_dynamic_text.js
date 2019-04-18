const renderBody = (block, context) => {
    if (!block.highlightable) {
        renderText(block, context);
    } else {
        renderHighlightableText(block, context);
    }
};

const renderText = (block, { res }) => {
    res.markup += `
        <h2>{{${block.csvTitleVariable}}}</h2>
        <p>{{${block.csvVariable}}}</p>`;
};

const renderHighlightableText = (block, context) => {
    const res = context.res;

    res.markup += `
    <div class="html-element-wrapper marker-target" data="${block.highlightedCsvVariable}">
        <h2>{{${block.csvTitleVariable}}}</h2>
        <p>{{${block.csvVariable}}}</p>                  
        <div>
            <button class="opt-clear">Clear highlights</button> 
            <small class="small">Select from the text above to highlight the part that supports your decision.</small>
        </div>
    </div>
    <!-- Hidden field -->
    <cml:textarea label="${block.question}" validates="required" name="${block.highlightedCsvVariable}"/>`;

    context.textHighlight = true;
};

const renderFooter = (context) => {
    if (context.textHighlight) {
        addHighlightScriptsAndStyles(context);
    }
};

const addHighlightScriptsAndStyles = ({ res }) => {
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
            };
            // Handles to the objects created by the highlight library.
            // There is a handle for every paper.
            var handlers = [];
            // Initialize the highlite libraries for every paper and setups
            // listeners to clear the highlighted parts
            function initialize () {
            var papers = $(".marker-target p");
            for (var i = 0; i < papers.length; i++) {
                var paper = papers[i];
                var id_task = $(paper).parent().parent().attr('id');
                var name_var = $(paper).parent().attr('data');
                var hand = new TextHighlighter(paper, {
                    onAfterHighlight: afterHighlight
                });
                if(handlers[id_task] === undefined)
                    handlers[id_task] = [];
                handlers[id_task][name_var] = hand;
        
                $("." + name_var).css("width", "0px").css("height", "0px").css("padding", "0px").css("border", "0px");
            }
            setupClearSingleHighlight();
            setupClearAllHighlightsButton();
            }
            initialize();
            function afterHighlight(range, normalizedHighlights, timestamp) {
                var id_task = $(range.commonAncestorContainer).parent().parent().attr('id');
                var name_var = $(range.commonAncestorContainer).parent().attr('data');
                updateHiddenField(handlers[id_task][name_var], name_var);
                hideValidationError(range);
            };
            // Add the listener to handle a click on an highlighted part (to remove it)
            function setupClearSingleHighlight () {
            $(".marker-target p").on("click", ".highlighted", function(e) {
                var $el = $(e.currentTarget);
                var id_task = $el.parent().parent().parent().attr('id');
                var name_var = $el.parent().parent().attr('data');
                handlers[id_task][name_var].removeHighlights($el[0]);
                updateHiddenField(handlers[id_task][name_var], name_var);
            });
            }
            // Add the listneer for the button to clear all the highlights of a paper
            function setupClearAllHighlightsButton() {
            $(".opt-clear").click(function(e) {
                e.preventDefault();
                var $el = $(e.currentTarget);
                var id_task = $el.parent().parent().parent().attr('id');
                var name_var = $el.parent().parent().attr('data');
                handlers[id_task][name_var].removeHighlights();
                updateHiddenField(handlers[id_task][name_var], name_var);
            });
            }
            function updateHiddenField(marks, name_var) {
                $hiddenField = $(marks.el).parents().filter(".cml").children().find("." + name_var);
                var pattern = "";
                if (marks.getHighlights().length > 0) {
                    pattern = marks.serializeHighlights();
                }
                $hiddenField.val(pattern);
            };
            function hideValidationError (marks, name_var) {
                $els = $(marks.commonAncestorContainer).parents().filter(".cml").children();
                $hiddenField = $els.parents().filter(".cml").children().find("." + name_var);
                // This is just to make the error message dissapear when selecting
                // the pattern after a validation error
                if ($els.find("." + name_var).hasClass("validation-failed")) {
                    $hiddenField.focusWithoutScrolling();
                    $els.filter(".cml").children().find(".excl_crit").focusWithoutScrolling();
                }
            }
        }`;
    res.css += `
        .marker-target p {
            cursor: copy;
        }
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
        }
    `;
};

module.exports = {
    renderBody,
    renderFooter
};
