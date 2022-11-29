const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} = require('graphql');
const QuestionType = require("./QuestionType");
const Question = require("../models/question");
const CategoryType = require("./CategoryType");
const Category = require("../models/category");

const TopicType = new GraphQLObjectType({
    name: 'Topic',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        categoryId: {type: GraphQLID},
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return Category.findById(parent.categoryId)
            }
        },
        description: {type: GraphQLString},
        questions: {
            type: new GraphQLList(QuestionType),
            resolve(parent, args) {
                return Question.find({topicId: parent.id})
            }
        }
    }),
});

module.exports = TopicType;
