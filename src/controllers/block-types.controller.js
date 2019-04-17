const express = require('express');
const blockTypesDelegate = require(__base + 'delegates/block-types.delegate');

const router = express.Router();

// GET /block-types
router.get('/block-types', async (req, res, next) => {
    try {
        let blockTypes = await blockTypesDelegate.getAll();
        res.json(blockTypes);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

// GET /block-types/<block-type id>
router.get('/block-types/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let blockType = await blockTypesDelegate.get(id);

        res.json(blockType);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
