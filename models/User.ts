import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false,
    },
    inbox: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Email',
        default: [],
    }],
    opened: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Email',
        default: [],
    }],
}, { timestamps: true });

// Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to check if entered password is correct
UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
