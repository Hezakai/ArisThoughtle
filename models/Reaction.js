const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionID: { type: ObjectId, required: true }, //Default value is set to a new ObjectId
  reactionBody: { type: String, required: true}, //add 280 character limit
  username: { type: String, required: true },
  friends: { type: Array}, // references the user model?  
  createdAt: { type: Date, default: Date.now, required: true }, //getter to format??
});

//This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.

module.exports = reactionSchema;