const Mutation = {
	createUser(_, args, { db }) {
		const isEmailTaken = db.users.some(user => user.email === args.email);

		if (isEmailTaken) {
			throw new Error('Email already used');
		}

		const user = { _id: uuidv4(), ...args };
		db.users.push(user);
		return user;
	},

	createPost(_, args, { db }) {
		const userExists = db.users.some(user => user._id === args.author);

		if (!userExists) {
			throw new Error("Invalid user");
		}

		const post = { id: uuidv4(), ...args }
		db.posts.push(post);
		return post;
	},

	createComment(_, args, { db }) {
		const userExists = db.users.some(user => user._id === args.author);
		const postExists = db.posts.some(post => post._id === args.author);

		if (!userExists) throw new Error("Invalid user");
		if (!postExists) throw new Error("Invalid post");

		const comment = { _id: uuidv4(), ...args };
		db.comments.push(comment);
		return comment;
	},

	deleteUser(_, { _id }, { db }) {
		const userIndex = db.users.findIndex(user => user._id === _id);

		if (userIndex === -1) {
			throw new Error('Invalid user');
		}

		// Cascade delete
		db.posts = db.posts.filter(post => {
			if (post.author === _id) {
				db.comments = db.comments.filter(comment => comment.post !== post._id);
				return false;
			}
			return true;
		});

		return db.users.splice(userIndex, 1);
	},

	deletePost(_, { _id }, { db }) {
		const postIndex = db.posts.findIndex(post => post._id === _id);

		if (postIndex === -1) {
			throw new Error('Invalid post');
		}

		// Cascade delete
		db.comments = db.comments.filter(comment => comment.post !== _id);

		return db.posts.splice(postIndex, 1);
	},

	deleteComment(_, { _id }, { db }) {
		const commentIndex = db.comments.findIndex(comment => comment._id === _id);
		if (commentIndex === -1) throw new Error('Invalid comment');
		return db.comments.splice(commentIndex, 1);
	},

	updateUser(_, { _id, userInput }, { db }) {
		const user = db.users.find(user => user._id = _id);

		if (!user) throw new Error('Invalid user');

		if (typeof userInput.email === 'string') {
			const emailTaken = db.users.some(user => user.email === userInput.email);
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

export default Mutation;
