import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid';

const typeDefs = `
	type Query {
		greeting(name: String): String!
	  book: Book!
		me: User!
	}
	
	type User {
		id: ID!
		name: String!
		email: String!
		age: Int
	}
	
	type Book {
		id: ID!
		title: String!
		rating: Float
		releaseYear: Int
		hasStock: Boolean!	
	}
`

const resolvers = {
	Query: {
		greeting: (parent, args, ctx, info) => {
			console.log('[PARENT]', parent);
			console.log('[INFO]', info);
			console.log('[CTX]', ctx);
			return `Hello ${args.name || 'Anonymous!'}!`
		},
		book: () => ({
			id: uuidv4(),
			title: 'Gunnm',
			rating: 5.0,
			releaseYear: null,
			hasStock: true,
		}),
		me: () => ({
			id: uuidv4(),
			name: 'Nacho',
			email: 'ignacioromanherrera@gmail.com',
			age: null,
		})
	},
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('Server listening on localhost:4000'));
