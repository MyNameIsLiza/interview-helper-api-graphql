const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
} = require('graphql');

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        answer: {type: GraphQLString},
        topicId: {type: GraphQLID},
        description: {type: GraphQLString},
    }),
});

module.exports = QuestionType;
