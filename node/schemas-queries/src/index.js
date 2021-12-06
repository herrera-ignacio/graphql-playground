import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid';

const typeDefs = `
	type Query {
		greeting(name: String): String!
		skills: [String!]!
	  book: Book!
		me: User!
		add(numbers: [Float!]!): Float!
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
		}),
		skills() {
			return ['Javascript', 'Node', 'React'];
		},
		add(parent, args) {
			if (Array.isArray(args.numbers)) {
				return args.numbers.reduce((acc, curr) => acc + curr, 0);
			}
			return 0;
		}
	},
}

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('Server listening on localhost:4000'));
