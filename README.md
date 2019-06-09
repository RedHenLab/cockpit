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
