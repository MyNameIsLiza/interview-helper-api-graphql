const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');
const {ObjectId} = require('mongodb');

const Movies = require('../models/movie');
const Directors = require('../models/director');
const Topic = require("../models/topic");
const Category = require("../models/category");
const Question = require("../models/question");
const CategoryType = require("../types/CategoryType");
const QuestionType = require("../types/QuestionType");
const TopicType = require("../types/TopicType");

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return Directors.findById(parent.directorId)
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movies.find({directorId: parent.id});
            },
        },
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCategory: {
            type: CategoryType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
            },
            resolve(parent, args) {
                const category = new Category({
                    ...args
                });
                return category.save();
            },
        },
        addTopic: {
            type: TopicType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                categoryId: {type: GraphQLID},
            },
            async resolve(parent, args) {
                return (new Topic({...args, categoryId: ObjectId(args.categoryId)})).save();
            },
        },
        updateTopic: {
            type: TopicType,
            args: {
                id: {type: GraphQLID},
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                categoryId: {type: GraphQLID},
            },
            resolve(parent, args) {
                console.log('parent', parent);
                console.log('args', args);
                return Topic.findByIdAndUpdate(
                    args.id,
                    {$set: {...parent, ...args}},
                    {new: true},
                );
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                directorId: {type: GraphQLID},
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId,
                });
                return movie.save();
            },
        },
        deleteDirector: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    {$set: {name: args.name, age: args.age}},
                    {new: true},
                );
            },
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                directorId: {type: GraphQLID},
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    {$set: {name: args.name, genre: args.genre, directorId: args.directorId}},
                    {new: true},
                );
            },
        },
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        category: {
            type: CategoryType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Category.findById(args.id);
            },
        },
        topic: {
            type: TopicType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Topic.findById(args.id);
            },
        },
        question: {
            type: QuestionType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Question.findById(args.id);
            },
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parent, args) {
                return Category.find({});
            }
        },
        topics: {
            type: new GraphQLList(TopicType),
            resolve(parent, args) {
                return Topic.find({});
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});
