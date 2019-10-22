const fs = require('fs');

const renderBody = (block, context) => {
    const res = context.res;
    if (!block.highlightable) {
        renderText(block, context);
    } else {
        renderHighlightableText(block, context);
    }

    res.input_spec[block.csvVariable] = {
        type: "string",
        required: true
    };
    res.input_spec[block.csvTitleVariable] = {
        type: "string",
        required: true
    };
};

const renderText = (block, {res}) => {
    res.markup += String.raw`
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

const addHighlightScriptsAndStyles = ({res}) => {
    res.javascript += fs.readFileSync(__dirname + '/resources/input_dynamic_text_script.js').toString();
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
