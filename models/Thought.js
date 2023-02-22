const mongoose = require('mongoose');

const thoughtSchema = new thought.Schema({
  thoughtText: { type: String, required: true }, //needs char verification 1-280
  createdAt: { type: Date, default: Date.now, required: true }, //getter to format??
  username: { type: String, required: true },
  reactions: { type: Array}, // Array of nested documents created with the reactionSchema?
});


//virtuals?  "Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.""

const Thought = mongoose.model('Thought', thoughtSchema);
const handleError = (err) => console.error(err);

Thought.create(
  {
    thoughtText: 'Think Thought Thaght!',
    createdAt: 'test@email.com',
    username: 'testUser',
    reactions: [],
  },
  (err) => (err ? handleError(err) : console.log('Created new document'))
);

module.exports = Thought;
