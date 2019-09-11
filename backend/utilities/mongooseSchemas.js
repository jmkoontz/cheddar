import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  _id: String,
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  }
});
