# Cockpit: Monitoring System for Red Hen Lab Capture Stations

This repository has 3 parts:

    root/
    |    coop/     The backend server written in Node.js and express
    |    panel/    The dashboard frontend written in React
    |    scripts/  Set of scripts to be run on the Capture Stations

## Setup

Coop and Panel are run together

The scripts are to be loaded on the capture stations


## Coop

**Note:  Coop requires mongodb to be running** 

To run coop, first navigate to the `coop` folder 

`cd coop`


If this is the first time you are running it, download the dependencies with yarn

`yarn`

Run the server 

`yarn start`

## Frontend Dashboard

Navigate to the `panel` folder

`cd panel`

If this is the first time you are running it, download the dependencies with yarn

`yarn`

Run the dashboard

`yarn start`

# Blog 

This is my project as a Google Summer of Code 2019 student for Red Hen Labs. I maintain a weekly summary of activities here.

1. [**Google Summer of Code '19 - The application process**](https://medium.com/@animysore/gsoc-19-the-application-process-and-being-accepted-30ce8d134951)
2. [**Week 1**](https://medium.com/@animysore/google-summer-of-code-2019-week-1-9dbaf8572c24)
2. [**Week 2**](https://medium.com/@animysore/google-summer-of-code-2019-week-2-d5af857a5b80)
