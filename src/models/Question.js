const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const CategoryParentSchema = new Schema({
    id: { type: Number, required: false },
    name: {
        id: { type: Number, required: false },
        textUzLat: { type: String, required: false },
        textUzCyr: { type: String, required: false },
        textRu: { type: String, required: false }
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
    id: { type: Number, required: false },
    name: {
        id: { type: Number, required: false },
        textUzLat: { type: String, required: false },
        textUzCyr: { type: String, required: false },
        textRu: { type: String, required: false },
        textEn: { type: String }
    },
    parent: CategoryParentSchema,
    isDisabled: { type: Boolean, default: false }
});

const QuestionSchema = new mongoose.Schema({
    chat_id: { type: Number },
    productId: {
        type: String,
        required: false
    },
    photo: [mongoose.Schema.Types.Mixed],
    name: {
        id: { type: Number, required: false },
        textUzLat: { type: String, required: false },
        textUzCyr: { type: String, required: false },
        textRu: { type: String, required: false }
    },
    category: CategorySchema,
    answerText: {
        type: String,
        required: false,
    },
    answers: [mongoose.Schema.Types.Mixed],
    correct: {
        type: mongoose.Schema.Types.Mixed, // To'g'ri javob
        required: false
    },
    createdByChatId: {
        type: String, // Foydalanuvchi chat ID
        required: false
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
    },
    newProducts: {
        type: Boolean,
        default: false
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