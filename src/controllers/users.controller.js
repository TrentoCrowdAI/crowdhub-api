const express = require('express');
const usersDelegate = require(__base + 'delegates/users.delegate');

const router = express.Router();

router.get('/users', async (req, res, next) => {
    try {
        let email = req.query.email;
        let users = await usersDelegate.getAll(email);
        res.json(users);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

router.get('/users/:id', async (req, res, next) => {
    try {
        let id = req.param.id;
        let user = await usersDelegate.get(id);
        res.json(user);
    } catch (e) {
        // we delegate to the error-handling middleware
        next(e);
    }
});

module.exports = router;
