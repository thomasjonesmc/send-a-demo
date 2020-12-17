# Send A Demo

## First Time Clone Setup

1. change into the backend with `cd sendAdemo-backend` and install server dependencies with `npm i`

2. Create a file called `.env` in the server to store environment variables, that should look like the below, but you will need your own credentials.

```
MONGODB_CONNECTION_STRING=<your-string>
JWT_SECRET=<your-secret>
BUCKET=<your-bucket>
AWS_ACCESS_KEY_ID=<your-id>
AWS_SECRET_ACCESS_KEY=<your-key>
AWS_REGION=<your-region>
AWS_UPLOADED_FILE_URL_LINK=<your-link>
```

3. Change to the frontend with `cd ../sendAdemon-frontend`

4. Open the frontend's `package.json` and find the `proxy` property in the json file. You'll most likely want to change that to `http://localhost:8080/` so your front end sends api requests to localhost:8080, where the backend listens.

## Run this project

1. run `npm start` out of the `sendAdemo-backend` directory

2. run `npm start` out of the `sendAdemo-frontend` directory

3. visiit http://localhost:3000 to view the project in your browser