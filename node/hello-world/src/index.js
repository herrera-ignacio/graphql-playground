import { GraphQLServer } from 'graphql-yoga';

// Type defs (schema)
const typeDefs = `
	type Query {
		welcome: String!
    hello(name: String!): String!
  }
`

const resolvers = {
	Query: {
		welcome() {
			return 'Welcome!'
		},
		hello(_, { name }) {
			return `Hello ${name}`
		}
	}
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
	console.log("Server is up in port 4000!");
});
