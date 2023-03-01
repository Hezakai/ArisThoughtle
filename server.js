const express = require('express');
const db = require('./config/connection');
const { User, Thought, } = require('./models');
const reactionSchema = require("./models/Reaction")
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});


//ROUTES
//ROUTES
//ROUTES


//can find all users or be used to search by an _id
app.get('/users/:id?', (req, res) => {
  const { id } = req.params;

  if (id) {
    User.findById(id, (err, result) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else if (!result) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).json(result);
      }
    });
  } else {
    User.find({}, (err, result) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  }
});


//create new user
app.post('/users', (req, res) => {
  const { username, email } = req.body;

  User.create({ username, email }, (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});


//update existing user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  User.findByIdAndUpdate(id, { username, email }, { new: true }, (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    } else if (!result) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.status(200).json(result);
    }
  });
});

//Deletes User and all User Thoughts
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    await Thought.deleteMany({ username: user.username });

    await User.findByIdAndDelete(id);

    res.status(200).send({ message: 'User and Thoughts deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

//Add a new Friend to an existing user
app.post('/users/:userId/friends/:friendId', (req, res) => {
  const { userId, friendId } = req.params;

  User.findByIdAndUpdate(userId, { $push: { friends: friendId } }, { new: true })
    .populate('friends')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        const friend = user.friends.find(f => f._id.toString() === friendId);
        res.status(200).send({ message: `${friend.username} has been added as a friend to ${user.username}` });
      }
    });
});

//Remove a Friend from an existing user
app.delete('/users/:userId/friends/:friendId', (req, res) => {
  const { userId, friendId } = req.params;
  const removed = friendId

  User.findByIdAndUpdate(
    userId,
    { $pull: { friends: friendId } },
    { new: true }
  )
    .populate('friends')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send({ message: `${removed} has been removed from ${user.username}'s friend list` });
      }
    });
});

//can find all Thoughts or be used to search by an _id
app.get('/thoughts/:id?', (req, res) => {
  const { id } = req.params;

  if (id) {
    Thought.findById(id, (err, result) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else if (!result) {
        res.status(404).send({ message: 'Thought not found' });
      } else {
        res.status(200).json(result);
      }
    });
  } else {
    Thought.find({}, (err, result) => {
      if (err) {
        res.status(500).send({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  }
});


//create new thought
app.post('/thoughts', (req, res) => {
  const { thoughtText, username, userId } = req.body;

  Thought.create({ thoughtText, username}, (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    } else {
      const thoughtId = result._id;
      User.findByIdAndUpdate(userId, { $push: { thoughts: thoughtId } }, { new: true })
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: 'Internal Server Error' });
        } else if (!user) {
          res.status(404).send({ message: 'User not found' });
        } else {
          res.status(200).send({ message: `${thoughtId} has been added to ${user.username}'s thoughts` });
        }
      });
    }
  });
});

//update existing thought
app.put('/thoughts/:id', (req, res) => {
  const { id } = req.params;
  const { thoughtText } = req.body;

  Thought.findByIdAndUpdate(id, { thoughtText}, { new: true }, (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Internal Server Error' });
    } else if (!result) {
      res.status(404).send({ message: 'Thought not found' });
    } else {
      res.status(200).json(result);
    }
  });
});

//Deletes Thought by ID
app.delete('/thoughts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const thought = await Thought.findById(id);
    if (!thought) {
      return res.status(404).send({ message: 'Thought not found' });
    }

    await Thought.findByIdAndDelete(id);

    res.status(200).send({ message: `Thought ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

//creates a new reaction
app.post('/thoughts/:thoughtId/reactions', (req, res) => {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;

  Thought.findById(thoughtId)
    .then(thought => {
      if (!thought) {
        return res.status(404).send({ message: 'Thought not found' });
      }

      // Create a new reaction object
      const newReaction = {
        reactionBody,
        username,
      };

      // Add the newly generated reaction's _id to the reactions array in the thought
      thought.reactions.push(newReaction);

      // Save the updated thought
      return thought.save();
    })
    .then(thought => {
      res.status(200).json(thought);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ message: 'Internal Server Error' });
    });
});

app.delete('/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reactionId } = req.body;
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).send({ message: 'Thought not found' });
    }

    await Thought.findByIdAndUpdate({ _id: thoughtId }, { $pull: { reactions: { _id: reactionId } } }, { new: true });

    res.status(200).send({ message: `Reaction ${reactionId} deleted successfully removed from thought ${thoughtId}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


// await Parent.findOne().populate('child')