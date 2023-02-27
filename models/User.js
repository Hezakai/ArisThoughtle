const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trimmed: true },
  email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Error: Incorrect E-Mail Format']  }, //is this correct?
  thoughts: { type: Array, ref: 'Thought' },
  friends: { type: Array, ref: 'User' },
  lastAccessed: { type: Date, default: Date.now }, //do I need this?
});

userSchema.virtual('friendCount').get(function () {
  return this.friends.length
}) ;

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

module.exports = User;


// getSingleUser(req, res) {
//   User.findOne({ _id: req.params.userId })
//     .select('-__v')
//     .populate('posts')
//     .then((user) =>
//       !user
//         ? res.status(404).json({ message: 'No user with that ID' })
//         : res.json(user)
//     )
//     .catch((err) => res.status(500).json(err));
// },