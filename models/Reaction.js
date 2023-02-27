const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionID: { type: ObjectId, required: true }, //Default value is set to a new ObjectId
  reactionBody: { type: String, required: true, maxlength: 280}, //no minlength?
  username: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now, required: true, get: createdAtVal => dateFormat(createdAtVal) }, //getter to format??
});

//This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.

function dateFormat(date) {
  return new Date(date).toLocaleDateString();
}

module.exports = Reaction;  //no seeing Reaction?