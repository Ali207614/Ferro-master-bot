const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const childProductSchema = new Schema({
    id: { type: Number, required: false },
    name: {
        id: { type: Number, required: false },
        textUzLat: { type: String, required: false },
        textUzCyr: { type: String, required: false },
        textRu: { type: String, required: false }
    },
    parentProduct: {
        id: { type: Number, required: false },
        name: {
            id: { type: Number, required: false },
            textUzLat: { type: String, required: false },
            textUzCyr: { type: String, required: false },
            textRu: { type: String, required: false }
        },
        category: {
            id: { type: Number, required: false },
            name: {
                id: { type: Number, required: false },
                textUzLat: { type: String, required: false },
                textUzCyr: { type: String, required: false },
                textRu: { type: String, required: false },
                textEn: { type: String, required: false }
            },
            parent: {
                id: { type: Number, required: false },
                name: {
                    id: { type: Number, required: false },
                    textUzLat: { type: String, required: false },
                    textUzCyr: { type: String, required: false },
                    textRu: { type: String, required: false },
                    textEn: { type: String, required: false }
                },
                icon: {
                    id: { type: Number, required: false },
                    name: { type: String, required: false },
                    url: { type: String, required: false },
                    size: { type: Number, required: false },
                    createdDate: { type: Date, required: false }
                },
                isDisabled: { type: Boolean, required: true, default: false }
            },
            icon: {
                id: { type: Number, required: false },
                name: { type: String, required: false },
                url: { type: String, required: false },
                size: { type: Number, required: false },
                createdDate: { type: Date, required: false }
            },
            isDisabled: { type: Boolean, required: true, default: false }
        },
        photos: [{
            id: { type: Number, required: false },
            photo: {
                id: { type: Number, required: false },
                name: { type: String, required: false },
                url: { type: String, required: false },
                size: { type: Number, required: false },
                createdDate: { type: Date, required: false }
            },
            sort: { type: Number, required: true, default: 0 }
        }],
    },
    searchableName: { type: String, required: false },
    photos: [mongoose.Schema.Types.Mixed], // Photos can be empty, so an empty array is allowed
    isParent: { type: Boolean, required: false, default: false },
    externalId: { type: String, required: false },
    unit: {
        id: { type: Number, required: false },
        name: {
            id: { type: Number, required: false },
            textUzLat: { type: String, required: false },
            textUzCyr: { type: String, required: false },
            textRu: { type: String, required: false },
            textEn: { type: String, required: false }
        }
    },
    isDiscounted: { type: Boolean, required: false, default: false },
    isDisabled: { type: Boolean, required: false, default: false },
    country: { type: String, required: false },
    amountNotEnough: { type: Boolean, required: false, default: false },
    properties: [{
        id: { type: Number, required: false },
        propertyValue: {
            id: { type: Number, required: false },
            property: {
                id: { type: Number, required: false },
                key: { type: String, required: false },
                name: {
                    id: { type: Number, required: false },
                    textUzLat: { type: String, required: false },
                    textUzCyr: { type: String, required: false },
                    textRu: { type: String, required: false },
                    textEn: { type: String, required: false }
                },
                type: { type: String, required: false }, // e.g., 'SIZE'
                subType: { type: String, required: false }, // e.g., 'INNER_DIAMETER'
                unit: {
                    id: { type: Number, required: false },
                    name: {
                        id: { type: Number, required: false },
                        textUzLat: { type: String, required: false },
                        textUzCyr: { type: String, required: false },
                        textRu: { type: String, required: false },
                        textEn: { type: String, required: false }
                    }
                }
            },
            value: {
                id: { type: Number, required: false },
                textUzLat: { type: String } // Can be empty, so no required
            }
        },
        sort: { type: Number, required: false, default: 0 }
    }]
}, {
    timestamps: true // This will add `createdAt` and `updatedAt` fields
});

const ChildProduct = mongoose.model('ChildProduct', childProductSchema);

module.exports = ChildProduct;
