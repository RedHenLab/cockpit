# Cockpit: Monitoring System for Red Hen Lab Capture Stations

This repository has 3 parts:

    root/
    |    coop/     The backend server written in Node.js and express
    |    panel/    The dashboard frontend written in React
    |    scripts/  Set of scripts to be run on the Capture Stations

A more detailed explanation of folder organisation can be found below

# Setup and Running

Coop and Panel are run together

The scripts are to be loaded on the capture stations


## Coop

**Note:  Coop requires a mongodb server and a mail server to function correctly. The mongodb server can be run locally. It is recommended to use a 3rd party mail server if you do not have one setup already, like gmail or sendgrid.** 

To run coop, first navigate to the `coop` folder

`cd coop`

Create a `.env` file using the example provided. 

`cp .env.example .env`

Edit this file and add the appropriate configurations for MongoDB and the SMTP server.

If this is the first time you are running it, download the dependencies with yarn

`yarn`

Run the server

`yarn start`

## Dashboard

Navigate to the `panel` folder

`cd panel`

If this is the first time you are running it, download the dependencies with yarn

`yarn`

Run the dashboard

`yarn serve`

To run tests

`yarn test`

# Contributing Guide

## Coop

The folder organisation is as follows:

```    
coop
├── config
│   ├── auth.js
│   ├── express.js
│   ├── index.js
│   ├── mailer.js
│   ├── passport.js
├── jobs
│   └── jobs.js
├── models
│   ├── report.model.js
│   ├── stations.model.js
│   └── user.model.js
├── src
│   ├── control.js
│   └── telemetry.js
├── test
│   ├── auth-user.test.js
│   ├── station-crud.test.js
│   └── station-ssh.test.js
├── index.js
├── package.json
└── yarn.lock
```

## Dashboard

```
panel
├── public
│   ├── favicon.png
│   ├── index.html
│   └── manifest.json
├── src
│   ├── components
│   │   ├── Add.js
│   │   ├── DetailedInfo.js
│   │   ├── Edit.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── Login.js
│   │   ├── Notification.js
│   │   ├── Report.js
│   │   └── Table.js
│   ├── services
│   │   ├── API.js
│   │   ├── Formatting.js
│   │   └── JWT.js
│   ├── App.css
│   ├── App.js
│   ├── config.js
│   ├── index.css
│   ├── index.js
│   ├── logo.png
│   └── serviceWorker.js
├── package.json
└── yarn.lock
```

# Blog 

This was my project as a Google Summer of Code 2019 student for Red Hen Labs. I maintained a weekly summary of activities here.

1. [**Google Summer of Code '19 - The application process**](https://medium.com/@animysore/gsoc-19-the-application-process-and-being-accepted-30ce8d134951)
2. [**Week 1**](https://medium.com/@animysore/google-summer-of-code-2019-week-1-9dbaf8572c24)
3. [**Week 2**](https://medium.com/@animysore/google-summer-of-code-2019-week-2-d5af857a5b80)
4. [**Week 3 and 4**](https://medium.com/@animysore/gsoc19-week-3-and-4-95ba4ba5142f)
5. [**First Evaluation Week**](https://medium.com/@animysore/first-evaluation-for-google-summer-of-code-19-f58b33264d9f)
6. [**Week 6**](https://medium.com/@animysore/google-summer-of-code-2019-week-6-b3d8451e43d4)
7. [**Final Report**](https://medium.com/@animysore/google-summer-of-code-2019-week-6-b3d8451e43d4)