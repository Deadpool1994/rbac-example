/**
 * UserModel file
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
 username: {
  type: String,
  required: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  default: 'stormtrooper',
  enum: ["stormtrooper", "sith"]
 },
 accessToken: {
  type: String
 }
});
 
const User = mongoose.model('user', UserSchema);
 
module.exports = User;