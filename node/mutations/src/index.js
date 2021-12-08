import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

const usersData = [...require('./users.json')];
const postsData = [...require('./posts.json')];
const commentsData = [...require('./comments.json')];

const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		comments: [Comment!]!
		me: User!
	}
	
	type Mutation {
		createUser(name: String!, email: String!, age: Int): User!
	}
	
	type User {
		_id: ID!
		name: String!
		email: String!
		age: Int
		posts: [Post!]!
	}
	
	type Post {
		_id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
	}
	
	type Comment {
		_id: ID!
		text: String!
		author: User!
		post: Post!
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

const commentsResolver = () => commentsData;

const resolvers = {
	Query: {
		users: usersResolver,
		posts: postsResolver,
		comments: commentsResolver,
		me() {
			return {
				id: "1",
				name: "Ignacio Herrera",
				email: "ignacioromanherrera@gmail.com",
			}
		}
	},

	Post: {
		author: post => usersData.find(user => user._id === post.author),
	},

	User: {
		posts: user => postsData.filter(post => post.author === user._id),
	},

	Comment: {
		author: comment => usersData.find(user => user._id === comment.author),
		post: comment => postsData.find(post => post._id === comment.post),
	},

	Mutation: {
		createUser(_, args) {
			const isEmailTaken = usersData.some(user => user.email === args.email);

			if (isEmailTaken) {
				throw new Error('Email already used');
			}

			const user = {
				_id: uuidv4(),
				name: args.name,
				email: args.email,
				age: args.age,
			}

			usersData.push(user);

			return user;
		}
	}
}



new GraphQLServer({ typeDefs, resolvers })
	.start(() => { console.log('Server running in localhost:4000'); });
