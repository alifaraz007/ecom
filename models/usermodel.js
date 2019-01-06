const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')
const md5 = require('md5')

const UserSchema = new Schema({
    email: {
        type: String, unique: true, lowercase: true
    },
    password: String,

    profile: {
        name: {
            type: String, default: ''
        },
        picture: {
            type: String, default: ''
        }
    },

    address: String,
    history: [{
        date: Date,
        paid: {
            type: Number, default: 0
        }
    }]
})

UserSchema.pre('save', function (next) {
    let user = this
    if (!user.isModified('password')) return next()
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.gravatar = function(size){
    if(!this.size) size = 200;
    if(!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    return `https://gravatar.com/avatar/${md5(this.email)}?s=${size}&d=retro`;
}

module.exports = mongoose.model('User', UserSchema)