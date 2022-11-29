const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('../schema/schema');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3005;

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

require('./initDB')();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Server started. http://localhost:${PORT}/graphql`);
});
