const express = require('express');
const { json2csvAsync } = require('json-2-csv');
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
        let id = req.params.id;

        let result = await runsDelegate.getResult(id);

        let format = req.query.format;
        if (format && format.toLowerCase() === "csv") {
            try {
                if (Object.keys(result).length > 0)
                    result = result[Object.keys(result)[0]];

                let csv = await json2csvAsync(result);
                res.header('Content-Type', 'text/csv').status(200).send(csv);
            }
            catch (e) {
                res.status(500).send("Error: Not able to parse the result as a csv!");
            }
        }
        else {
            res.json(result);
        }
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;