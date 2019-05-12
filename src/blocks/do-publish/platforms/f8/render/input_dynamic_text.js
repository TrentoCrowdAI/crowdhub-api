const fs = require('fs');

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
    res.javascript += fs.readFileSync(__dirname + '/resources/input_dynamic_text_script.js').toString();
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
