const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    id: { type: Number, required: true },
    name: {
        id: { type: Number, required: true },
        textUzLat: { type: String, required: true },
        textUzCyr: { type: String, required: true },
        textRu: { type: String, required: true },
        textEn: { type: String }
    },
    subCategories: [this],
    isDisabled: { type: Boolean, default: false }
});

const CategorySchema = new Schema({
    id: { type: Number, required: true },
    name: {
        id: { type: Number, required: true },
        textUzLat: { type: String, required: true },
        textUzCyr: { type: String, required: true },
        textRu: { type: String, required: true }
    },
    subCategories: [SubCategorySchema],
    icon: {
        id: { type: Number },
        name: { type: String },
        url: { type: String },
        size: { type: Number },
        createdDate: { type: Date }
    },
    isDisabled: { type: Boolean, default: false },
    sort: { type: Number }
});

const Catalog = mongoose.model('Catalog', CategorySchema);

module.exports = Catalog;