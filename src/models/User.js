import { Schema, model } from "mongoose";
import bcript from 'bcrypt';

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true, //index
        validate: [/@[A-Za-z0-9]+.[A-Za-z0-9]+$/, 'Invalid email address!'],
        minLength: [10, 'Email is too short!'],
    },
    password: {
        type: String,
        validate: [/^[A-Za-z0-9]+$/, 'Invalid password characters!'],
        minLength: [6, 'Your password is too short'],
    },
});

userSchema.virtual('rePassword')
    .set(function(value) {
        if (value !== this.password) {
            throw new Error('Password missmatch!');
        }
    });
    
// hash password before save
userSchema.pre ('save', async function () {
    const hash = await bcript.hash(this.password, SALT_ROUNDS);

    this.password = hash;
});

const User = model('User', userSchema);

export default User;