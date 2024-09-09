const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    id: { type: Number, required: false },
    photo: {
        id: { type: Number, required: false },
        name: { type: String, required: false },
        url: { type: String, required: false },
        size: { type: Number, required: false },
        createdDate: { type: Date, required: false }
    },
    sort: { type: Number }
});

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

const ProductSchema = new Schema({
    id: { type: Number, required: false },
    name: {
        id: { type: Number, required: false },
        textUzLat: { type: String, required: false },
        textUzCyr: { type: String, required: false },
        textRu: { type: String, required: false }
    },
    brand: {
        id: { type: Number, },
        name: { type: String, }
    },
    category: CategorySchema,
    photos: [PhotoSchema],
    isParent: { type: Boolean, default: true },
    externalId: { type: String, default: "" },
    isDiscounted: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    country: { type: String, default: "CN" },
    variantsCount: { type: Number, default: 0 },
    amountNotEnough: { type: Boolean, default: false },
    properties: { type: Array, default: [] }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
