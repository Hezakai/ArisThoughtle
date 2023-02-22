const mongoose = require('mongoose');

const userSchema = new user.Schema({
  username: { type: String, required: true }, //look up unique and trimmed and add
  email: { type: String, required: true}, //look up and add unique and validation
  thoughts: { type: Array}, // array of ids referencing the thoughts to the user?
  friends: { type: Array}, // references the user model?  
  lastAccessed: { type: Date, default: Date.now }, //do I need this?
});


//virtuals?  "Create a virtual called friendCount that retrieves the length of the user's friends array field on query."

const User = mongoose.model('User', userSchema);
const handleError = (err) => console.error(err);

User.create(
  {
    username: 'testUser1',
    email: 'test1@email.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'testUser2',
    email: 'test2@email.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'testUser3',
    email: 'test3@email.com',
    thoughts: [],
    friends: [],
  },
  (err) => (err ? handleError(err) : console.log('Created new document'))
);

module.exports = Item;
