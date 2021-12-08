const usersQuery = (_parent, args, { db }) => {
	if (!args.query) {
		return db.users;
	} else {
		return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
	}
}

const postsQuery = (_parent, args, { db }) => {
	if (!args.query) {
		return db.posts;
	}

	return db.posts.filter((post) => {
		const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
		const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
		return isTitleMatch || isBodyMatch;
	})
}

const commentsQuery = (_parent, _args, { db }) => db.comments;

export default {
	users: usersQuery,
	posts: postsQuery,
	comments: commentsQuery,
};
