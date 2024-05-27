# Get Bearer Demo Application &#128171;

This is a small application I created as a test assignment. The application is a web page where users can enter an organization ID (strictly 24 characters) and choose one of two environments (staging and production). Upon clicking submit, a request is sent to the backend, which generates a Bearer string for authentication and returns it to the frontend.

[Live Demo](https://get-bearer.vercel.app/)

## How to start this application locally:

To install dependencies and start the application, run the following commands:

```bash
npm install
npm run start
```

## App Overview

There were no specific requirements for this app, so I decided to build it without any frameworks or build tools like webpack or esbuild. The goal was to keep it as simple as possible. For local serving, I use [live-server](https://www.npmjs.com/package/live-server) and with its `--proxy` option, I can redirect requests to the local backend. The app is deployed using [GitHub Actions](https://docs.github.com/en/actions) and [Vercel](https://vercel.com/).

For testing the API, I used [Jest](https://www.npmjs.com/package/jest).

## Folder Structure

1. [frontend/](./frontend/) Contains all front-end related code:
   - [index.html](./frontend/index.html) The main HTML file that serves as the entry point for the front-end.
   - [styles.css](./frontend/styles.css) CSS file for styling the front-end components.
   - [script.js](./frontend/script.js) JavaScript file for front-end functionality.
1. [backend/](./backend/) Contains all back-end related code:
   - [api/](./backend/api) Directory for API-related scripts:
     - [generate-token.js](./backend/api/generate-token.js) Script to generate tokens.
   - [server.js/](./backend/server.js) The main server file that sets up and configures the local server.
   - [server-listen.js/](./backend/server-listen.js) Script to start the server and begin listening for requests.
   - [consts.js/](./backend/consts.js) Contains constants used for testing.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs both the local front-end and back-end servers concurrently. It uses `npm run start-frontend` to start the front-end server and `npm run start-backend` to start the back-end server.

### `npm run start-frontend`

Navigates to the `frontend` directory and starts a live server on the http://127.0.0.1:8080/. The live-server is configured to proxy API requests to http://localhost:3001/api, which has the back-end endpoints.

### `npm run start-backend`

This script navigates to the `backend` directory and starts the back-end server by running the `server-listen.js` script with Node.js on the port http://localhost:3001. This sets up the server to handle API requests.

### `npm run test`

Runs the test suite using Jest. The `--testTimeout=10000` option ensures that tests have a maximum of 10 seconds to complete, and `--detectOpenHandles` helps detect and report any open handles that could cause the tests to hang.
