import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

let usersData = [...require('./users.json')];
let postsData = [...require('./posts.json')];
let commentsData = [...require('./comments.json')];

const typeDefs = `
	type Query {
		users(query: String): [User!]!
		posts(query: String): [Post!]!
		comments: [Comment!]!
		me: User!
	}
	
	type Mutation {
		createUser(userInput: CreateUserInput): User!
		createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
		createComment(text: String!, author: ID!, post: ID!): Comment!
		deleteUser(_id: ID!): User!
		deletePost(_id: ID!): Post!
		deleteComment(id: ID!): Comment!
		updateUser(_id: ID!, userInput: UpdateUserInput!): User!
	}
	
	input CreateUserInput {
		name: String!
		email: String!
		age: Int
	}
	
	input UpdateUserInput {
		name: String
		email: String
		age: Int
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

			const user = { _id: uuidv4(), ...args };
			usersData.push(user);
			return user;
		},

		createPost(_, args) {
			const userExists = usersData.some(user => user._id === args.author);

			if (!userExists) {
				throw new Error("Invalid user");
			}

			const post = { id: uuidv4(), ...args }
			postsData.push(post);
			return post;
		},

		createComment(_, args) {
			const userExists = usersData.some(user => user._id === args.author);
			const postExists = postsData.some(post => post._id === args.author);

			if (!userExists) throw new Error("Invalid user");
			if (!postExists) throw new Error("Invalid post");

			const comment = { _id: uuidv4(), ...args };
			commentsData.push(comment);
			return comment;
		},

		deleteUser(_, { _id }) {
			const userIndex = usersData.findIndex(user => user._id === _id);

			if (userIndex === -1) {
				throw new Error('Invalid user');
			}

			// Cascade delete
			postsData = postsData.filter(post => {
				if (post.author === _id) {
					commentsData = commentsData.filter(comment => comment.post !== post._id);
					return false;
				}
				return true;
			});

			return usersData.splice(userIndex, 1);
		},

		deletePost(_, { _id }) {
			const postIndex = postsData.findIndex(post => post._id === _id);

			if (postIndex === -1) {
				throw new Error('Invalid post');
			}

			// Cascade delete
			commentsData = commentsData.filter(comment => comment.post !== _id);

			return postsData.splice(postIndex, 1);
		},

		deleteComment(_, { _id }) {
			const commentIndex = commentsData.findIndex(comment => comment._id === _id);
			if (commentIndex === -1) throw new Error('Invalid comment');
			return commentsData.splice(commentIndex, 1);
		},

		updateUser(_, { _id, userInput }) {
			const user = usersData.find(user => user._id = _id);

			if (!user) throw new Error('Invalid user');

			if (typeof userInput.email === 'string') {
				const emailTaken = usersData.some(user => user.email === userInput.email);
				if (emailTaken) throw new Error('Email is already used');
				user.email = userInput.email;
			}

			if (typeof userInput.name === 'string') {
				user.name = userInput.name;
			}

			if (!isNaN(Number(userInput.age))) {
				user.age = Number(userInput.age);
			}
		}
	}
}

new GraphQLServer({ typeDefs, resolvers })
	.start(() => { console.log('Server running in localhost:4000'); });
