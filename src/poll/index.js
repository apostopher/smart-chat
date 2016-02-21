'use strict';

const router = require('express').Router();
const loadChatItem = require('./load.chat.item');
const pollsController = require('./polls.controller');

router.post('/vote', loadChatItem, pollsController.vote);

module.exports = router;
