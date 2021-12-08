const Post = {
	author: (post, _args, { db }) => db.users.find(user => user._id === post.author),
}

export default Post;
