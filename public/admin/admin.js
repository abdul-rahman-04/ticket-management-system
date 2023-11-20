document.addEventListener('DOMContentLoaded', async () => {
    // Populate source and destination dropdowns on page load
    await populateDropdown('source');
    await populateDropdown('destination');

    // Add an event listener for the "Search Routes" button
    const searchButton = document.querySelector('button');
    searchButton.addEventListener('click', searchRoutes);
});

async function populateDropdown(dropdownId) {
    // Fetch source-destination pairs from the server
    const sourceDestinationResponse = await fetch('/api/source-destinations');
    const { sourceDestinations } = await sourceDestinationResponse.json();

    // Populate the dropdown menu
    const dropdown = document.getElementById(dropdownId);
    sourceDestinations.forEach(({ source, destination }) => {
        const option = document.createElement('option');
        if (dropdownId === 'source') {
            option.value = `${source}`;
            option.text = `${source}`;
        } else {
            option.value = `${destination}`;
            option.text = `${destination}`;
        }
        dropdown.add(option);
    });
}

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'ticket_management';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if the connection fails
    }
};

// Get the form and submit button
const form = document.getElementById('add-new-route');
const submitButton = document.getElementById('add-new-route-button');

// Attach the event listener to the form
form.addEventListener('submit', addNewRecord());

// Function to add a new record
const addNewRecord = async (newRecordData) => {
    const db = client.db(dbName);
    const collection = db.collection('buses');

    try {
        // Insert the document into the collection
        const result = await collection.insertOne(newRecordData);
        console.log('Document inserted:', result.insertedId);
        return { success: true, insertedId: result.insertedId };
    } catch (error) {
        console.error('Error inserting document:', error);
        return { success: false, error: 'Internal server error' };
    }
};

// Close the MongoDB connection when the application is shutting down
process.on('SIGINT', () => {
    console.log('Closing MongoDB connection');
    client.close();
    process.exit();
});

module.exports = { connectToDatabase, addNewRecord };