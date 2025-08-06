const gql = require('graphql-tag');


const typeDefs = gql`
type User {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  me: User!
}

type Mutation {
  register(email: String!, password: String!, firstName: String!, lastName: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}
`;

module.exports = typeDefs