const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => props.value + " n'est pas un email valide!",
      },
    },
    verification_token: {
      type: String,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    is_activated: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      validate: {
        validator: function (value) {
          return (
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[!@#$%^&*]/.test(value)
          );
        },
        message:
          "Le mot de passe doit contenir au moins une lettre majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*)",
      },
    },
    name: {
        type: String,
        default: null,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    
    },
    avatar: {
      type: String,
      default: null,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramLike',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    collection: 'users', 
    timestamps: true,   
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
