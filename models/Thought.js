const mongoose = require('mongoose');
const reactionSchema = require('./Reaction')

const thoughtSchema = new mongoose.Schema({
  thoughtText: { type: String, required: true }, //needs char verification 1-280
  createdAt: { type: Date, default: Date.now, required: true }, //getter to format??
  username: { type: String, required: true },
  reactions: [reactionSchema], // Array of nested documents created with the reactionSchema?

}, {
  toJSON: { getters: true, virtuals: true },
  id: false,
}
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length
});

const Thought = mongoose.model('Thought', thoughtSchema);
const handleError = (err) => console.error(err);

Thought.create(
  {
    thoughtText: 'Think Thought Thaght!',
    username: 'testUser',
    reactions: [],
  },
  (err) => (err ? handleError(err) : console.log('Created new document'))
);

module.exports = Thought;
