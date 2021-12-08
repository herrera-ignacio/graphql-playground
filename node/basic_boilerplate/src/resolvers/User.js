const User = {
	posts: (user, _args, { db }) => db.posts.filter(post => post.author === user._id),
}

export default User;
