// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username:     { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    photoUrl:     { type: String, default: null },
    bio:          { type: String, default: null, maxlength: 300 },
    coinBalance:  { type: Number, default: 0, min: 0 },
    isPremium:    { type: Boolean, default: false },
    isVerified:   { type: Boolean, default: false },
    role:         { type: String, enum: ["PLAYER", "MODERATOR", "ADMIN"], default: "PLAYER" },
    pin:          { type: String, default: null, select: false },
    twoFASecret:  { type: String, default: null, select: false },
    twoFAEnabled: { type: Boolean, default: false },
    badges:       [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.pin;
        delete ret.twoFASecret;
        return ret;
      },
    },
  }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+passwordHash");
  if (!user) return null;
  const match = await user.comparePassword(password);
  return match ? user : null;
};

module.exports = mongoose.model("User", userSchema);