# Simple Social
Simple social is a code sample to get started with a social network like app.

## Run locally
Local website is accessible through port `3000`, backend through `8000`. Make sure to have `mongo` service running, the data is stored in the `/test` schema.
```bash
cd back/
npm start&
cd ../front/
curl http://localhost:8000/health && \ # we make sure backend is started before running frontend
    npm start 
pkill node #kills backend on front end exit
```

## Run on docker
Dockerized API is accessible through port `8080`.
```
cd back/
docker compose up&
cd ../front/
curl http://localhost:8080/health && \ # we make sure backend is started before running frontend
   REACT_APP_IS_IN_DOCKER=true npm start 
```

## Run tests
To run api tests, use `npm test`.

## Sources
[Authentification](https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/), 
[Tests](https://dev.to/easybuoy/testing-node-api-with-mocha-chai-248b), 
[Dockerize node](https://dev.to/vguleaev/dockerize-a-node-js-app-connected-to-mongodb-5bp1)
