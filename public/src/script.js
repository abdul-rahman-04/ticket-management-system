function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Retrieve values from query parameters
const source = getQueryParam('source');
const destination = getQueryParam('destination');
const travelDate = getQueryParam('travelDate');

// Access the container and span elements
const sourceSpan = document.getElementById('results-source');
const destinationSpan = document.getElementById('results-destination');
const dateSpan = document.getElementById('travel-date');

// Update the HTML content with the values
sourceSpan.textContent = source;
destinationSpan.textContent = destination;
dateSpan.value = travelDate;

searchRoutes();

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

async function searchRoutes() {
    // Get the selected source, destination, and travel date
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const travelDate = document.getElementById('travel-date').value;

    // Combine source and destination to send as a single parameter
    const sourceDestination = `${source}-${destination}`;

    // Make a request to the server to get the schedule
    const scheduleResponse = await fetch(`/api/schedule/${sourceDestination}?date=${travelDate}`);
    const schedule = await scheduleResponse.json();

    // Display the schedule results
    displayScheduleResults(schedule);
}

function displayScheduleResults(schedule) {
    const scheduleResultsContainer = document.getElementById('schedule-results');
    scheduleResultsContainer.innerHTML = '';

    if (schedule.error === 'Schedule not found for the provided source-destination.') {
        scheduleResultsContainer.innerHTML = '<p>Oops! No buses found.</p>';
    } else if (schedule.length === 0) {
        scheduleResultsContainer.innerHTML = '<p>No available schedule for the selected date.</p>';
    } else {
        const scheduleList = document.createElement('ul');
        scheduleList.setAttribute('id', 'searchList');
        schedule.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.setAttribute('departure-time', entry.departureTime);
            listItem.setAttribute('duration', entry.duration);
            listItem.setAttribute('price', entry.price);
            listItem.textContent = `Date: ${entry.date}, Departure Time: ${entry.departureTime}, Arrival Time: ${entry.arrivalTime}, Duration: ${entry.duration}, Price: ${entry.price}, Seats Available: ${entry.seatsAvailable}`;
            scheduleList.appendChild(listItem);
        });
        scheduleResultsContainer.appendChild(scheduleList);
    }
}