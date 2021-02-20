const mongoose = require(`mongoose`)
const crypto = require(`crypto`)
const uuidv1 = require(`uuidv1`) 
const { isLength } = require('buffer')

const userSchema = new mongoose.Schema({
  
  name : {
    type: String,
    trim: true,
    required: true,
    maxlength: 32,  
  },

  email : {
    type: String,
    trim: true, 
    required: true,
    unique: 32,
  },

  hashed_password : {
    type: String,
    trim: true,
  },

  about : {
    type: String,
    trim: true,
  },

  salt : String,

  role: {
    type: Number,
    default: 0
  },

  history: {
    type: Array,
    default: []
  }
  

}, {timestamps: true})

// VIRTUAL FIELD
userSchema.virtual(`password`)
.set(function(password) {
  this.hashed_password = password
  this.salt = uuidv1()
  this.hashed_password = this.encryptPassword(password)
})
.get(function() {
  return this.password
})

userSchema.methods = {

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
        return "";
    }
  }
}

module.exports = mongoose.model('User', userSchema)