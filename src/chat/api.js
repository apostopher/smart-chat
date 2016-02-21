'use strict';
const winston = require('winston');
const Chat = require('./chat.model');
const router = require('express').Router();

router.get('/', function(req, res){
  Chat.find({}).sort({createdAt: -1}).limit(10).execAsync().then((data)=>{
  
    res.status(200).send(data);
  }).catch((error)=>{
    winston.error(error);
    res.status(200).send([]);
  });
});

module.exports = router;