const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    emp_id: { type: Number },
    first_name: { type: String },
    last_name: { type: String },
    // chat_id: { type: Number, unique: true },
    chat_id: { type: Number },
    job_title: { type: String, default: '' },
    user_step: { type: Number, required: true, default: 1 },
    mobile: { type: String },
    back: { type: [mongoose.Schema.Types.Mixed], default: [] },
    custom: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastMessageId: { type: Number, default: 1 },
    confirmed: { type: Boolean, default: false },
    confirmed_at: { type: Date }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const User = mongoose.model('User', userSchema);

module.exports = User;