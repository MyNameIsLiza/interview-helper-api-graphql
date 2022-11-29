const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CategorySchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
});

CategorySchema.plugin(uniqueValidator);

const Category = mongoose.model('categories', CategorySchema);
module.exports = Category;
