const mongoose = require('mongoose');
const reactionSchema = require('./Reaction')

const thoughtSchema = new mongoose.Schema({
  thoughtText: { type: String, required: true, minlength: 1, maxlength: 280, },
  createdAt: { type: Date, default: Date.now, required: true, get: createdAtVal => dateFormat(createdAtVal) }, //getter to format??
  username: { type: String, required: true },
  reactions: [reactionSchema],

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

function dateFormat(date) {
  return new Date(date).toLocaleDateString();
}

module.exports = Thought;