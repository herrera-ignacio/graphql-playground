import { GraphQLServer } from 'graphql-yoga';

const usersData = require('./users.json');
const postsData = require('./posts.json');

const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		me: User!
	}
	
	type User {
		_id: ID!
		name: String!
		email: String!
		age: Int
	}
	
	type Post {
		_id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
	}
`

const usersResolver = (_parent, args) => {
	if (!args.query) {
		return usersData;
	} else {
		return usersData.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
	}
}

const postsResolver = (_parent, args) => {
	if (!args.query) {
		return postsData;
	}

	return postsData.filter((post) => {
		const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
		const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
		return isTitleMatch || isBodyMatch;
	})
}

const resolvers = {
	Query: {
		users: usersResolver,
		posts: postsResolver,
		me() {
			return {
				id: "1",
				name: "Ignacio Herrera",
				email: "ignacioromanherrera@gmail.com"
			}
		}
	},

	Post: {
		author: (post) => usersData.find(user => user._id === post.author)
	}
}



new GraphQLServer({ typeDefs, resolvers })
	.start(() => { console.log('Server running in localhost:4000'); });
