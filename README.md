
# Authentication Service

Stateless session based authentication service to manage authentication services



![App Screenshot](https://i.imgur.com/vXurx4O.png)


## Features

- [x]  Authentication REST API's
- [x]  Stateless authentication implementation
- [x]  Sessions management
    - Create new valid sessions
    - One or more sessions invalidating
- [x]  Role/Permissions based authorization
- [x]  Dockerization
- [x]  Unit testing


## Tech Stack

- **Nodejs (Typescript)**
- **Expressjs**
- **MongoDB**
- **Redis (where sessions live in)**
- **Docker**
- **Jest (testing)**


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
  - *Update .env file as .env.example file*

    Run development enviroment
    ```bash
    npm run dev
    ```
- **Production**
  - *Update .env file as .env.example file*

    Build/Compile typescript
    ```bash
    npm run build
    ```
    Run production server
    ```bash
    npm run build
    ```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` *The http server port*

`MONGO_CONNECTION_STRING` *Mongo database connection string*

`REDIS_HOST` *Redis Server host*

`REDIS_PORT` *Redis Server port*

`ACCESS_TOKEN_SECRET` *JWT secret private key*

`ACCESS_TOKEN_EXPIRES_IN` *JWT expiration period*
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
