const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionID: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() }, //Default value is set to a new ObjectId
  reactionBody: { type: String, required: true, maxlength: 280}, //no minlength?
  username: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now, required: true, get: createdAtVal => dateFormat(createdAtVal) },
});

function dateFormat(date) {
  return new Date(date).toLocaleDateString();
}

module.exports = reactionSchema;
