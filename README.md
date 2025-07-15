# Safe Harbor Website

## Backend

https://github.com/Robert-MacWha/safe-harbor-db

## Configuration

### Firebase Hosting

[Firebase Hosting](https://firebase.google.com/docs/hosting/) is used for deployment. It offers [experimental compatability](https://github.com/FirebaseExtended/firebase-framework-tools) with sveltekit and seems to function. Deployments are setup to auto-occure on push to main, and can be configured by modifying the github workflows or using the CLI. To debug locally, run `npm run build` to build the project then `firebase emulators:start` to start the firebase emulators and launch the server.

> Cloudflare pages was previously used, but because of an incomatability with firestore (possibly due to an incomplete compatability with NPM), we can't access required data and thus had to migrate.

#### Deployment

Run `firebase deploy` or `firebase firebase hosting:channel:deploy CHANNEL_ID` to deploy the website to firebase hosting. Non-prod channels will be deleted after 7 days.
