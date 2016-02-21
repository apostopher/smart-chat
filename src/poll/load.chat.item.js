'use strict';

const _ = require('lodash');
const winston = require('winston');
const mongoose = require('mongoose');
const Chat = require('../chat/chat.model');
module.exports = loadChatItem;

// Implementation ---
function loadChatItem(req, res, next) {
  let  chatId;
  try {
    chatId = new mongoose.Types.ObjectId(_.get(req, 'body.id'));
  } catch (error) {
    winston.error(error);
    return res.status(401).send({error: 'chat not found.'});
  }
  Chat.findOneAsync({_id: chatId}).then((found)=>{
    if(found.messageType !== 'poll') {
      return res.status(401).send({error: 'chat not found.'});
    } else {
      _.set(req, 'body.chat', found);
      next();
    }
  }).catch((error)=>{
    winston.error(error);
    return res.status(401).send({error: 'chat not found.'});
  });
}