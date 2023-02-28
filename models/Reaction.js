const mongoose = require('mongoose');
// const { ObjectId } = require('mongoose').Types;

const reactionSchema = new mongoose.Schema({
  reactionID: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() }, //Default value is set to a new ObjectId
  reactionBody: { type: String, required: true, maxlength: 280}, //no minlength?
  username: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now, required: true, get: createdAtVal => dateFormat(createdAtVal) },
});

//This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.

function dateFormat(date) {
  return new Date(date).toLocaleDateString();
}

module.exports = reactionSchema;  //not seeing Reaction?

// module.exports = mongoose.model('Reaction', reactionSchema)