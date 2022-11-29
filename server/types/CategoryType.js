const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} = require('graphql');
const Topic = require("../models/topic");
const TopicType = require("../types/TopicType");

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        topics: {
            type: new GraphQLList(TopicType),
            resolve(parent, args) {
                return Topic.find({categoryId: parent.id})
            }
        }
    }),
});

module.exports = CategoryType;
