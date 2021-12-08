const Comment = {
	author: (comment, _args, { db }) => db.users.find(user => user._id === comment.author),
	post: (comment, _args, { db }) => db.posts.find(post => post._id === comment.post),
}

export default Comment;
