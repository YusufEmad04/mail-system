import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: [{
        type: String,
        required: true,
    }],
    cc: [{
        type: String,
    }],
    bcc: [{
        type: String,
    }],
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    attachments: [{
        name: String,
        url: String,
        size: Number,
        type: String,
    }],
}, {
    timestamps: true,
});

export default mongoose.models.Email || mongoose.model('Email', EmailSchema);
