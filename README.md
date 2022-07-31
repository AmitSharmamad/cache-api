# cache-api

Welcome to the Cache API. A sample project to cache your key value pairs using Mongo database as the cache store.

Clone the project and update the properties in `.env` as per your needs.


## Get Started

Clone the project using `git clone https://github.com/AmitSharmamad/cache-api`

and install the dependencies using

`npm install`   or   `yarn install`


## Configuration

Following are the properties that need to set before you start the process.

`CACHE_EXPIRY_TIME`:        The time for which your cache should be alive, after which the tuple expires.

`CACHE_KEY_LIMIT`:          The limit of number of cache items.

`MONGO_DB_CONNECTION_URL`:  Mongo DB's connection url, example: (mongodb://localhost/cache)

`TURN_ON_SECURITY`:         Set this property if you need your API to be secured.

`SECUTIRY_KEY`:             Set this value and do not expose it to the external world.

`LOG_LEVEL`:                Helps in understanding the logs better


## How to run

The project is built on NestJS framework. Check the `package.json` file for all the scripts.
You can get started with the below mentioned scripts.

`npm|yarn run start`     - Start the process in a prod environment

