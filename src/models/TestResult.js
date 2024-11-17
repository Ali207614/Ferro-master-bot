const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    id: { type: String, required: false },
    text: { type: String, required: false },
    isCorrect: { type: Boolean, required: false },
    correct: { type: String, required: false }
});

const nameSchema = new Schema({
    id: { type: Number, required: false },
    textUzLat: { type: String, required: false },
    textUzCyr: { type: String, required: false },
    textRu: { type: String, required: false }
});

const categoryNameSchema = new Schema({
    id: { type: Number, required: false },
    textUzLat: { type: String, required: false },
    textUzCyr: { type: String, required: false },
    textRu: { type: String, required: false },
    textEn: { type: String }
});

const parentCategorySchema = new Schema({
    id: { type: Number, required: false },
    name: {
        id: { type: Number, required: false },
        textUzLat: { type: String, required: false },
        textUzCyr: { type: String, required: false },
        textRu: { type: String, required: false }
    },
    icon: {
        id: { type: Number, required: false },
        name: { type: String, required: false },
        url: { type: String, required: false },
        size: { type: Number, required: false },
        createdDate: { type: Date, required: false }
    },
    isDisabled: { type: Boolean, default: false },
    _id: { type: Schema.Types.ObjectId, required: false }
});

const categorySchema = new Schema({
    id: { type: Number, required: false },
    name: categoryNameSchema,
    parent: parentCategorySchema,
    isDisabled: { type: Boolean, default: false },
    _id: { type: Schema.Types.ObjectId, required: false }
});

const testResultsSchema = new Schema({
    chat_id: { type: Number, required: false },
    productId: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    answers: [answerSchema],
    name: nameSchema,
    category: categorySchema,
    full: { type: Boolean, default: false },
    confirm: { type: Number, default: 0 },
    newProducts: {
        type: Boolean,
        default: false
    }
});
// confirm 0 tasdiqlanmagan , 1 tasdiqlangan 2 reject bo'lgan 


testResultsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

testResultsSchema.plugin(AutoIncrement, { inc_field: 'test_id' });
const TestResult = mongoose.model('TestResult', testResultsSchema);

module.exports = TestResult;
