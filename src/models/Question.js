const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const CategoryParentSchema = new Schema({
    id: { type: Number, required: true },
    name: {
        id: { type: Number, required: true },
        textUzLat: { type: String, required: true },
        textUzCyr: { type: String, required: true },
        textRu: { type: String, required: true }
    },
    icon: {
        id: { type: Number },
        name: { type: String },
        url: { type: String },
        size: { type: Number },
        createdDate: { type: Date }
    },
    isDisabled: { type: Boolean, default: false }
});

const CategorySchema = new Schema({
    id: { type: Number, required: true },
    name: {
        id: { type: Number, required: true },
        textUzLat: { type: String, required: true },
        textUzCyr: { type: String, required: true },
        textRu: { type: String, required: true },
        textEn: { type: String }
    },
    parent: CategoryParentSchema,
    isDisabled: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        id: { type: Number, required: true },
        textUzLat: { type: String, required: true },
        textUzCyr: { type: String, required: true },
        textRu: { type: String, required: true }
    },
    category: CategorySchema,
    answerText: {
        type: String,
        required: true,
    },
    answers: [mongoose.Schema.Types.Mixed],
    correct: {
        type: mongoose.Schema.Types.Mixed, // To'g'ri javob
        required: true
    },
    createdByChatId: {
        type: String, // Foydalanuvchi chat ID
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    }
});

// Pre-save middleware to update 'updatedAt'
QuestionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

QuestionSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;