# Kijiji Scraper App

## Description

A clean, responsive, lightweight application for scraping ads from Kijiji and displaying the results in a simplified way.

In the future this app will allow for subscribing to kijiji searches with text notifications.

This application was built using [mwpenny / kijiji-scraper](https://github.com/mwpenny/kijiji-scraper)

## Preview

![Preview](https://i.imgur.com/UAWaqU7.jpg)

## Features

* Retrieve current ads from Kijiji given keywords and other parameters
* Multi-tabbed & tagged search subscriptions to have as many searches as you need at one time.
* On-the-fly search filtering
* Search tab draggable sorting
* Customizable search refresh timer interval
* Change tracking
* Future Feature: Text/Email Notifications on new ads and price changes
* Responsive design, mobile friendly

## Prerequisites
:warning: **If you plan on running this app on localhost, you will need allow CORS in your browser.
There are many ways to do this, the quickest is to use a browser extension.**

#### Extension: [Allow CORS: Access-Control-Allow-Origin](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en)

## Dependencies

* Latest Version of [Node.js](https://nodejs.org/en/download/) installed on your system

## PUSHBULLET Setup

1. Create a copy of the .env.local.sample, and remove the .sample portion. You should now have a .env.local in your root project directory.
2. Add your PushBullet Api Key after the equals for the "VUE_APP_PUSH_BULLET_ACCESS_TOKEN" environment variable.
3. For now, you should recieve notifications on all of your devices connected to the API Token specified, if there are new ads added since the last run, or if the ads have changed price.

The .env.local file should look something like:
```
VUE_APP_PUSH_BULLET_ACCESS_TOKEN="YOUR KEY HERE"

VUE_APP_PUSH_BULLET_PHONENUMBER="YOUR PHONE NUMBER HERE"
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
