const gql = require('graphql-tag');


const typeDefs = gql`
type Note {
  id: ID!
  title: String!
  content: String!
  owner: User!
  sharedWith: [User!]!
  createdAt: String!
  updatedAt: String!
}

type Query {
  notes: [Note!]!
  note(id: ID!): Note
}

type Mutation {
  createNote(title: String!, content: String!): Note!
  updateNote(id: ID!, title: String, content: String): Note!
  deleteNote(id: ID!): Boolean!
  shareNote(id: ID!, email: String!): Note!
}
`;

module.exports = typeDefs;