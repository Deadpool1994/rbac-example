/**
 * userController File
 */
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../lib/roles');
 
async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
 return await bcrypt.compare(plainPassword, hashedPassword);
}
 
exports.signup = async (req, res, next) => {
 try {
  const { username, password, role } = req.body
  if(!username || !password ) {
    return res.status(400).send('Invalid parameters');
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ username, password: hashedPassword, role: role || "stormtrooper" });
  const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
   expiresIn: "1d"
  });
  newUser.accessToken = accessToken;
  await newUser.save();
  res.json({
   data: newUser,
   accessToken
  })
 } catch (error) {
  next(error)
 }
}

exports.login = async (req, res, next) => {
  try {
   const { username, password } = req.body;
   const user = await User.findOne({ username });
   if (!user) return res.status(401).send('Invalid user');
   const validPassword = await validatePassword(password, user.password);
   if (!validPassword) return next(new Error('Password is not correct'))
   const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
   });
   await User.findByIdAndUpdate(user._id, { accessToken })
   res.status(200).json({
    data: { username: user.username, role: user.role },
    accessToken
   })
  } catch (error) {
   next(error);
  }
 }

 exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
   try {
    const permission = roles.can(req.user.role)[action](resource);
    if (!permission.granted) {
     return res.status(401).json({
      error: "You don't have enough permission to perform this action"
     });
    }
    next()
   } catch (error) {
    next(error)
   }
  }
 }
  
 exports.allowIfLoggedin = async (req, res, next) => {
  try {
   const user = res.locals.loggedInUser;
   if (!user) {
     return res.status(401).json({
      error: "You need to be logged in to access this route"
     });
   }
    req.user = user;
    next();
   } catch (error) {
    next(error);
   }
 }

   // deathstar route - Acess by stromtrooper and sith both
 exports.getDeathStar = async (req, res, next) => {
  
  res.send('Close the blast doors! \u{1F4A9}');
 }

  // darkside route - Acess by sith only
 exports.getDarkSide = async (req, res, next) => {
  
  res.send("Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It’s not a story the Jedi would tell you. It’s a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life… He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful… the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death, but not himself.");
 }

 // Default route - Acess by anyone
 exports.greeting = async (req, res, next) => {

   res.send('may the force be with you');
 }