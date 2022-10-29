<h1 align="center"> Symphony - An awesome Spotify clone </h1>

<p> This application showcase how we can duplicate most of the functionality of Spottify within
a short amount of time using modern best practices and the power of React & Node.JS. <p>

You can see how this looks like in all its glory

![The application in action](./main.png)

## To run the application:

* Clone the repository
* Run the following commands to run the backend:

Update the `backend/config/dev.js` file to a valid MongoDB url (we don't store secrets in the repository).
By default, we use MongoDB on `localhost` and with no authentication.

    $ cd backend
    $ npm i
    $ npm run dev

* Run the following commands to run the frontend:

    $ cd frontend
    $ cd npm i
    $ npm start

## Deploying the application to production

In the `frontend` diretory, execute: `npm run build`

Copy the `build` directory to the backend's `public` diretory and push that to your production server.

Remember, for production usage, you need to update the `backend/config/prod.js` and set the production
values for `dbUrl` (MongoDB connection string) and `secretKey` (which is used as the encryption key for
encrypted cookies).
