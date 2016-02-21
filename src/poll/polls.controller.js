'use strict';

const _ = require('lodash');
const realtime = require('../realtime');

module.exports = {
  vote
};

// Implementation ---
function vote(req, res) {
  const chat = _.get(req, 'body.chat');
  const option = _.get(req, 'body.option');
  const username = _.get(req, 'body.username', '').trim().toLowerCase();
  if(_.has(chat.data, option)) {
    chat.data[option].ans = _.uniq(chat.data[option].ans.concat([username]));
    chat.markModified('data');
    console.log(chat);
    chat.saveAsync().then(()=>{
      realtime.broadcastMessage('poll response', chat);
      res.status(200).send();
    }).catch((error)=>{
      return res.status(500).send({error: 'something went wrong'});
    });
  } else {
    return res.status(400).send({error: 'invalid option'});
  }
}