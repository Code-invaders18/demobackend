const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, //without this field value...it will show the user an error
      maxlength: 32, //maximum length of the user input name
      trim: true, //to trim out the extra spaces
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true, //this(mongodb) will report an error if the user enters the duplicate mail
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number, //higher the number,more priviledges u will be having
      // if 0-user,1-account_checker,2-u r having administrator
      default: 0, //here for the user only ..we will edit it afterawards
    },
    purchases: {
      type: Array,
      default: [], //nobody buys anything of now
    },
  },
  { timestamp: true }
);
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });
userSchema.methods = {
  authenticate: function (plainpassword) {
    //if the given statement passes ,it will be- true ..if not- false
    return this.securePassword(plainpassword) === this.encry_password;
  },
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
