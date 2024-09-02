const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    id: { type: Number, required: true },
    photo: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number, required: true },
        createdDate: { type: Date, required: true }
    },
    sort: { type: Number }
});

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

const ProductSchema = new Schema({
    id: { type: Number, required: true },
    name: {
        id: { type: Number, required: true },
        textUzLat: { type: String, required: true },
        textUzCyr: { type: String, required: true },
        textRu: { type: String, required: true }
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
