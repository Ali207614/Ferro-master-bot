const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
    id: Number,
    textUzLat: String,
    textUzCyr: String,
    textRu: String,
    textEn: String,
});

const IconSchema = new mongoose.Schema({
    id: Number,
    name: String,
    url: String,
    size: Number,
    createdDate: Date,
});

const CategoryParentSchema = new mongoose.Schema({
    id: Number,
    name: TextSchema,
    icon: IconSchema,
    isDisabled: Boolean,
});

const CategorySchema = new mongoose.Schema({
    id: Number,
    name: TextSchema,
    parent: CategoryParentSchema,
    isDisabled: Boolean,
});

const PhotoSchema = new mongoose.Schema({
    id: Number,
    photo: {
        id: Number,
        name: String,
        url: String,
        size: Number,
        createdDate: Date,
    },
    sort: Number,
});

const UnitSchema = new mongoose.Schema({
    id: Number,
    name: TextSchema,
});

const PropertySchema = new mongoose.Schema({
    id: Number,
    propertyValue: {
        id: Number,
        property: {
            id: Number,
            key: String,
            name: TextSchema,
            unit: UnitSchema,
        },
        value: {
            id: Number,
            textUzLat: String,
        },
    },
    sort: Number,
});

const ProductSchema = new mongoose.Schema({

});

const MainSchema = new mongoose.Schema({
    id: Number,
    name: TextSchema,
    searchableName: String,
    category: CategorySchema,
    photos: [PhotoSchema],
    isParent: Boolean,
    externalId: String,
    unit: UnitSchema,
    isDiscounted: Boolean,
    isDisabled: Boolean,
    country: String,
    variantsCount: Number,
    amountNotEnough: Boolean,
    properties: [PropertySchema],
});

module.exports = mongoose.model('NewProduct', MainSchema);
