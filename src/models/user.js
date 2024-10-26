const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  images: { type: [String], required: true },
  infos: { type: [String], required: true },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  identification: { type: String, required: true },
  interest: { type: String, required: true },
  ageRange: { type: String, required: true },
  specificInterests: { type: String, required: true },
  interest: { type: [String], required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
});

const User = mongoose.model('Users', userSchema);
module.exports = User;
