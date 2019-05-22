const express = require('express');
const {json2csvAsync} = require('json-2-csv');
const runsDelegate = require(__base + 'delegates/runs.delegate');

const router = express.Router();

router.get('/runs', async (req, res, next) => {
    try {
        let workflowId = req.query.workflowId;
        let runs = await runsDelegate.getAll(workflowId);
        res.json(runs);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.get('/runs/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let run = await runsDelegate.get(id);

        res.json(run);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.get('/runs/:id/result', async (req, res, next) => {
    try {
        let runId = req.params.id;
        let format = req.query.format;
        let result = await runsDelegate.getResult(runId);
        await sendRunResultAs(result, format, `run-#${runId}-result`, res);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});


const sendRunResultAs = async (result, format, fileNameWithoutExtension, res) => {
    if (format && format.toLowerCase() === "csv") {
        await sendRunResultAsCsv(result, fileNameWithoutExtension, res);
    } else {
        sendRunResultAsJson(result, fileNameWithoutExtension, res);
    }
};

const sendRunResultAsCsv = async (result, fileNameWithoutExtension, res) => {
    try {
        if (Object.keys(result).length > 0)
            result = result[Object.keys(result)[0]];

        let csv = await json2csvAsync(result, fileNameWithoutExtension);
        sendCsvAsAttachment(csv, fileNameWithoutExtension, res);
    } catch (e) {
        console.error(e);
        res.status(500).send("Error: Not able to transform the result to a csv!");
    }
};

const sendCsvAsAttachment = (csv, fileNameWithoutExtension, res) => {
    res.header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename="${fileNameWithoutExtension}.csv"`)
      .status(200)
      .send(csv);
};

const sendRunResultAsJson = (result, fileNameWithoutExtension, res) => {
    res
      .header('Content-Disposition', `inline; filename="${fileNameWithoutExtension}.json"`)
      .json(result);
};

module.exports = router;
module.exports.sendRunResultAs = sendRunResultAs;
