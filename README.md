# Authentication Service

Stateless session based authentication service to manage authentication services
![Testing screenshot](https://i.imgur.com/vXurx4O.png)

## 🔗 Links

- [**Postman Collection**](https://documenter.getpostman.com/view/11631463/UyxnFR5F)

## Features

- [x] Authentication REST API's
- [x] Stateless authentication implementation
- [x] Sessions management
  - Create new valid sessions
  - One or more sessions invalidating
- [x] Role/Permissions based authorization
- [x] Dockerization
- [x] Unit testing

## Tech Stack

- **Nodejs (Typescript)**
- **Expressjs**
- **MongoDB**
- **Redis (where sessions live in)**
- **Docker**
- **Jest (testing)**


# How it works
- Starting by bootstraping the app, it creates http server and connects to mongodb and redis through connection/infrastructure layer

- Client can signup and signin through HTTP requests

- The controller layer construct the sent client data from the request

- The service layer handles the authentication business logic

- Repositories layer works as an interface for the database models

- The app creates jwt token which contains some userdata and the session id and sents it back to the client

- The app stores valid sessions in redis key/value store with a referenece to each user

- When the client tries to access protected route it firstly check the jwt token validation/expiration etc and then retrieves/checks the session from the redis store

- If session exists in the store, it will be considered as valid session

- If the protected route requires specific role/permission to be accessed, the application will compare this role/permission to the user role/allowed permissions

- The app can force invalidating single or more sessions by destroys the session from the redis store

## Installation

Clone the project

```bash
  git clone https://github.com/HassanFouaad/authentication-service
```

Go to the project directory

```bash
  cd authentication-service
```

Install dependencies

```bash
  npm install
```

- **Development**

  - _Update .env file as .env.example file_

    Run development enviroment

    ```bash
    npm run dev
    ```

- **Production**

  - _Update .env file as .env.example file_

    Build/Compile typescript

    ```bash
    npm run build
    ```

    Run production server

    ```bash
    npm run start
    ```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` _The http server port_

`MONGO_CONNECTION_STRING` _Mongo database connection string_

`REDIS_HOST` _Redis Server host_

`REDIS_PORT` _Redis Server port_

`ACCESS_TOKEN_SECRET` _JWT secret private key_

`ACCESS_TOKEN_EXPIRES_IN` _JWT expiration period_

## Test

The application uses Jest for testing

```sh
npm run test
```

## Docker deployment

The application is very easy to install and deploy in a Docker container.
By default, the Docker will expose port 9000, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd authentication-service
docker-compose up -d
```

This will create the the application image and pull in the necessary dependencies.

- Redis-server image
- Mongodb image
- Node application image

Once done, run the Docker image and map the port to whatever you wish on your host.

## Screenshots

#### Passed tests

![Auth passed test](https://i.imgur.com/wsx6T8k.png)

#### Postman api collection with examples

![alt text](https://i.imgur.com/DXFfd0r.png)

## 🔗 Postman Collection

- https://documenter.getpostman.com/view/11631463/UyxnFR5F
