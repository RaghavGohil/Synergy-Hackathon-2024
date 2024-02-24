const mongoose = require('mongoose');
const User = require('../models/userModel');

const databaseUrl = process.env.DATABASE_URL;

// connect to mongodb
mongoose.connect(databaseUrl)
.then(() => {console.log('signIn connected to MongoDB.')})
.catch(err => console.error(err));

module.exports.signInPost = async (req, res) => {
  try{
    const user = await User.findOne({ username : req.body.username});
    if (!user) {
      return res.status(401).send('Username not available');
    }

    const isMatch = (req.body.password === user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    res.redirect('/'); // Redirect to home on successful login
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}