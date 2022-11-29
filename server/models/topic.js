const mongoose = require('mongoose');
const Category = require("./category");
const {ObjectId} = require("mongodb");
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.ObjectId,
        ref: 'categories',
        required: true
    },
    description: {
        type: String,
        required: false
    },
});

TopicSchema.pre('save', async function(next) {
    const category = await Category.findById(ObjectId(this.categoryId));
    if (!category) {
        throw new Error(`Category with id=${this.categoryId} is missing`);
    }
    else next();
});

const Topic = mongoose.model('topics', TopicSchema);
module.exports = Topic;
