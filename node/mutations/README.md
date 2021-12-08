# Relational Data

## Mutations

### Create user

```graphql
mutation {
  createUser(
    userInput: {
      name: "Nacho"
      email: "nacho@example.com"
      age: 26
  	}
  ){
  	name
  }
}
```

### Create Post

```graphql
mutation {
  createPost(title: "My post", body: "Test body", published: true, author: 123) {
     _id
  }
}
```
