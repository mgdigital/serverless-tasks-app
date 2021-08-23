# Nodejs Coding Test: Tasks API

## Installation

- Install the app with `yarn install`
- Start the database server with `docker-compose up`
- Initialize database tables with `yarn db:initialize`
- Run tests with `yarn test`
- Start the API server with `yarn serve`

## Making requests to the server

### Add a task

```sh
curl --location --request PUT 'localhost:3000/dev/tasks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "My task"
}'
```

### Add a task list

```sh
curl --location --request PUT 'localhost:3000/dev/task-lists' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "My list"
}'
```

### Update a task's title and status, and add it to a list

```sh
curl --location --request PUT 'localhost:3000/dev/tasks/4940616c-b973-4662-b34c-f52fd8da44de' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "My renamed task",
    "status": "IN_PROGRESS",
    "addToLists": ["d082dc01-d24a-4efd-a705-c45bb58ec0c5"]
}'
```

### Remove a task from a list

```sh
curl --location --request PUT 'localhost:3000/dev/tasks/4940616c-b973-4662-b34c-f52fd8da44de' \
--header 'Content-Type: application/json' \
--data-raw '{
    "removeFromLists": ["d082dc01-d24a-4efd-a705-c45bb58ec0c5"]
}'
```

### Delete a task

```sh
curl --location --request DELETE 'localhost:3000/dev/tasks/4940616c-b973-4662-b34c-f52fd8da44de' \
--data-raw ''
```

## Notes

This app was based on https://github.com/postlight/serverless-typescript-starter
