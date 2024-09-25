# Subscriber Management Web App

## Overview

This web application is designed to manage subscribers using Campaign Monitor's API. It allows users to add and remove(delete) subscribers through a simple interface. The app consists of:

- A front-end that provides the user interface.
- A back-end that communicates with Campaign Monitor's API for managing subscriber data.

## Features

### Add Subscribers

- Users can enter a name and email to add a subscriber to a list. The data is sent to the back-end, which forwards it to Campaign Monitor.
- Upon successful addition, the subscriber is displayed in the list on the UI.

### Delete Subscribers

- Users can remove a subscriber from the list by clicking the "Delete" button. The subscriber is removed from both the UI and the Campaign Monitor list.

### Fetch and Display Subscribers

- When the page loads, the app fetches all current subscribers from the Campaign Monitor list and displays them in a table.

## Technologies Used

### Front-End:

- **HTML5**, **Bootstrap** for styling
- **JavaScript** (with Fetch API for making HTTP requests)

### Back-End:

- **Node.js**, **Express.js** for server logic
- **Axios** for making API requests to Campaign Monitor
- **dotenv** for managing environment variables (API keys)

### External API:

- **Campaign Monitor** (for handling subscriber data)

## Endpoints

### GET `/subscribers`:

- Fetches all subscribers from Campaign Monitor.
- Front-end calls this endpoint to populate the subscriber table.

### POST `/subscribers`:

- Adds a new subscriber to the list on Campaign Monitor.
- Accepts `name`, `email`, and `consentToTrack` from the front-end.

### DELETE `/unsubscribers`:

- Deletes a subscriber from the Campaign Monitor list.
- Accepts `email` in the request body to identify the subscriber to delete.

## Running the App

### Back-End:

- The back-end consists of `app.js`, `package.json`, `package-lock.json`, and `.env`.

1. Install dependencies: `npm install`
2. Run the server: `node app.js`
3. Ensure you have a `.env` file with your Campaign Monitor API key.

### Front-End:

- The front-end consists of `index.html` and `index.js`.
- Open `index.html` in a browser, which will interact with the back-end.
