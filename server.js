const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const app = express();
const port = 5000;
const schema = require('./schema/schema');

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})