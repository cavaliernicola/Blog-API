# Tongue API Documentation

## Introduction

This documentation provides an overview of the different endpoints, request/response examples.

## Base URL

The base URL for accessing the API is: `/api/v1/`

## Endpoints

- [Users](#users)
- [Posts](#posts)
- [Interactions](#interactions)

### Users

> 1. [Create a new user](#1-create-a-new-user)
> 2. [Get user profile](#2-create-a-new-post)
> 3. [Update information of an existing user](#3-update-information-of-an-existing-user)
> 4. [Delete an existing user](#4-delete-an-existing-user)

#### 1. Create a new user

**Endpoint**: `/users`
**Method**: `POST`

**Parameters**:

- `{username}` (required): The username of the user
- `{age}` (required): The age of the user
- `{city}` (required): The city of the user

**Example response**

```
HTTP/1.1 201 CREATED
```

```json
{
	"user": {
		"user_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"username": "username",
		"age": 20,
		"city": "venice"
	}
}
```

#### 2. Get user profile

**Endpoint**: `/users/{user_id}`
**Method**: `GET`

**Example response**

```
HTTP/1.1 200 OK
```

```json
{
	"user": {
		"user_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"username": "username",
		"age": 20,
		"city": "venice"
	}
}
```

#### 3. Update information of an existing user

**Endpoint**: `/users/{user_id}`
**Method**: `PATCH`

**Example response**

```
HTTP/1.1 200 OK
```

```json
{
	"user": {
		"user_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"username": "username",
		"age": 20,
		"city": "venice"
	}
}
```

#### 4. Delete an existing user

**Endpoint**: `/users/{user_id}`
**Method**: `DELETE`

**Example response:**

```
HTTP/1.1 204 NO CONTENT
```

### Posts

> 1. [Get a list of all posts](#1-get-the-list-of-all-posts)
> 2. [Create a new post](#2-create-a-new-post)
> 3. [Update an existing post with new values](#3-update-an-existing-post-with-new-values)
> 4. [Delete an existing post](#4-delete-an-existing-post)

#### 1. Get the list of all posts

**Endpoint**: `/posts`
**Method**: `GET`

**Parameters**:

- `{postDate}` (optional): The date when a post has been created.
  `Format`: A comma separated list of dates in the format "DD/MM/YYYY"
- `{interactionDate}` (optional): The date when an aggregate interaction of the post has been added.
  `Format`: A comma separated list of dates in the format "DD/MM/YYYY"
- `{interactionCity}` (optional): The city of the user that left an interaction.
- `{limit}` (optional): The limit of posts per result. Default: 10.
- `{page}` (optional): Used with limit for impagination. Default: 1.

> Note: The date parameters allow to show elements between a range of dates.</br> If only the first element is provided `(e.g postDate=20/10/2023)` only the posts greater or equal than that date will be shown.</br> If two dates are provided `(e.g postDate=20/10/2023,30/10/2023)` the posts made between those dates will be shown.</br> If only the second element is provided `(e.g postDate=,20/10/2023)` only posts lower or equal than that date will be shown.

**Example response**

```
HTTP/1.1 200 OK
```

```json
{
	"posts": [
		{
			"post_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
			"created_at": "YYYY-MM-DD HH:mm:ss",
			"title": "title",
			"interactions": [
				{
					"interaction_type": ["like", "comment"],
					"content": [null, "comment of the post"],
					"created_at": "YYYY-MM-DD HH:mm:ss",
					"city": "bologna"
				}
			]
		}
	]
}
```

#### 2. Create a new post

**Endpoint**: `/posts`
**Method**: `POST`

**Parameters**:

- `{title}` (required): The title of the post.

**Example response**

```
HTTP/1.1 201 CREATED
```

```json
{
	"post": {
		"post_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"title": "title",
		"created_at": "YYYY-MM-DD HH:mm:ss"
	}
}
```

#### 3. Update an existing post with new values

**Endpoint**: `/posts/{post_id}`
**Method**: `PATCH`

**Example response**

```
HTTP/1.1 200 OK
```

```json
{
	"post": {
		"post_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"title": "title",
		"created_at": "YYYY-MM-DD HH:mm:ss"
	}
}
```

#### 4. Delete an existing post

**Endpoint**: `/posts/{post_id}`
**Method**: `DELETE`

**Example response:**

```
HTTP/1.1 204 NO CONTENT
```

### Interactions

> 1. [Create a new interaction](#1-create-a-new-interaction)
> 2. [Get an interaction](#2-get-an-interaction)
> 3. [Update an existing interaction](#3-update-an-existing-interaction)
> 4. [Delete an existing interaction](#4-delete-an-existing-interaction)

#### 1. Create a new interaction

**Endpoint**: `/interactions`
**Method**: `POST`

**Parameters**:

- `{interaction_type}` (required): The type of the interaction. Allowed interactions: ["like", "comment"].
- `{content}` (optional): The content of a comment, must be provided only for comments.
- `{created_by}` (required): The `user_id` of an existing user that left an interaction.
- `{to_post}` (required): The `post_id` where the interaction has been left.

**Example response:**

```
HTTP/1.1 201 CREATED
```

```json
{
	"interaction": {
		"interaction_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"created_at": "YYYY-MM-DD HH:mm:ss",
		"interaction_type": "like",
		"content": null,
		"to_post": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"created_by": "98c7416e-650c-403f-a373-bcb40f3bc598"
	}
}
```

#### 2. Get an interaction

**Endpoint**: `/interactions/{interaction_id}`
**Method**: `POST`

**Example response:**

```
HTTP/1.1 200 OK
```

```json
{
	"interaction": {
		"interaction_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"created_at": "YYYY-MM-DD HH:mm:ss",
		"interaction_type": "like",
		"content": null,
		"to_post": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"created_by": "98c7416e-650c-403f-a373-bcb40f3bc598"
	}
}
```

#### 3. Update an existing interaction

> **Note**: Once you left an interaction, the API allows only to update `{interaction_type}` and `{content}`.

**Endpoint**: `/interactions/{interaction_id}`
**Method**: `PATCH`

**Example response:**

```
HTTP/1.1 200 OK
```

```json
{
	"interaction": {
		"interaction_id": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"created_at": "YYYY-MM-DD HH:mm:ss",
		"interaction_type": "like",
		"content": null,
		"to_post": "98c7416e-650c-403f-a373-bcb40f3bc598",
		"created_by": "98c7416e-650c-403f-a373-bcb40f3bc598"
	}
}
```

#### 4. Delete an existing interaction

**Endpoint**: `/interactions/{interaction_id}`
**Method**: `DELETE`

**Example response:**

```
HTTP/1.1 204 NO CONTENT
```
