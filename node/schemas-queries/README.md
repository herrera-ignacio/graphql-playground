# README

## Run Project

```
yarn install
yarn dev
```

Server will be running on _http://localhost:4000_.

## Test Queries

You can try the following queries from your browser:

```
query {
  greeting(name: "Nacho")
  book {
		id
    title
    rating
    releaseYear
    hasStock
  }
  me {
    id
    name
    email
    age
  }
  skills
  add(numbers: [1,4,7,9])
}
```
