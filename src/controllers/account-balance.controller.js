const express = require('express');
const accountBalanceDelegate = require(__base + 'delegates/account-balance.delegate');

const router = express.Router();

// GET /account-balance
router.get('/account-balance', async (req, res, next) => {
    try {
        let balance = await accountBalanceDelegate.getBalances();
        res.json(balance);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
