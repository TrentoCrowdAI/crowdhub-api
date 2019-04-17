const express = require('express');
const templateDelegate = require(__base + 'delegates/template-do.delegate');

const router = express.Router();

router.get('/template-do', async (req, res, next) => {
    try {
        let templs = await templateDelegate.getAll();
        res.json(templs);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});
router.get('/template-do/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let templ = await templateDelegate.get(id);

        res.json(templ);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.post('/template-do', async (req, res, next) => {
    try {
        let templ = req.body;
        let newTemplate = await templateDelegate.create(templ);
        res.status(201).json(newTemplate);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.put('/template-do/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let template = req.body;

        template = await templateDelegate.update(template, id);
        res.json(template);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.delete('/template-do/:id', async (req, res, next) => {
    try {
        let id = req.params.id;

        let template = await templateDelegate.deleteTemplate(id);
        res.json(template);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;