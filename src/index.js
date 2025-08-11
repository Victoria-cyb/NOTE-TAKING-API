const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const userResolvers = require('./resolvers/user');
const noteResolvers = require('./resolvers/note');
const userTypeDefs = require('./schemas/user');
const noteTypeDefs = require('./schemas/note');
const auth = require('./utils/auth');
const { startCron } = require('./utils/cron');


const app = express();

const typeDefs = [userTypeDefs, noteTypeDefs];
const resolvers = [userResolvers, noteResolvers];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({ user: await auth(req) }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' }); // Set endpoint to /graphql

  const PORT = process.env.PORT || 4000;
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
        startCron();
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
    });
}

startServer();